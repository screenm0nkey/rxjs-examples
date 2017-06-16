/*@MODULE*/
import Observable = Rx.Observable;
const DraggableDirective: angular.IDirectiveFactory = ($document: angular.IDocumentService, rx: SpgRxService, draggableService: SpgDraggableService) => ({
    restrict: 'A',
    require: '^^spgDraggableContainer',
    link(scope: angular.IScope, element: JQuery, attrs: Draggable.Attrs, ctrl: DraggableContainerController) {
        const {left: initX, top: initY} = element.css(['left', 'top']);
        const [ elHeight, elWidth ] = [element.height(), element.width()];
        let draggableSubscription;

        element.attr('draggable', 'false');
        scope.$on('$destroy', () => draggableSubscription && draggableSubscription.dispose());

        draggableSubscription = rx
            .fromEvent(element, 'mousedown')
            .map(draggableService.getCoorinates)
            .flatMapLatest(initateMousedown)
            .do(onDragStart)
            .flatMapLatest(onMouseMove)
            .map(draggableService.getCoorinates)
            .throttle(40)
            .do(onDrag)
            .subscribe();

        /*
         Initiates the mousedown action as soon as the mouse moves 10px from it's original location.
         The coordinates from here used to calculate the distance the mouse has moved.
         The stream completes as soon as one set of coordinates have been emitted.
         The merge(rx.timer) initiates the mousedown action if the user clicks but doesn't move the mouse.
         TakeUntil is needed in case there is a mousedown and mouseup without moving the mouse.
         */
        function initateMousedown(mousedownCoords: Draggable.Coord): SpgRx.IObservable<Draggable.Coord> {
            return rx
                .fromEvent($document, 'mousemove')
                .map(draggableService.getCoorinates)
                .filter(mousemoveCoords => draggableService.getDistanceBetween(mousemoveCoords, mousedownCoords) > 10)
                .throttle(25)
                .merge(rx.timer(500).map(() => mousedownCoords))
                .takeUntil(rx.fromEvent($document, 'mouseup'))
                .take(1)
        }

        /*
         Emits the coordinates of the mouse whilst it's in a mousedown state.
         Completes on mouseup action.
         */
        function onMouseMove(): SpgRx.IObservable<Draggable.Coord> {
            return rx
                .fromEvent($document, 'mousemove')
                .takeUntil(rx.fromEvent($document, 'mouseup'))
                .finally(onDragEnd)
        }

        function onDragStart({x, y}:  Draggable.Coord) {
            element.addClass('drag-active');
            ctrl.onDragStart(element);
            onDrag({x, y});
        }

        function onDrag({x, y}: Draggable.Coord) {
            let {x: left, y: top} = draggableService.getOffsetPosition({x, y}, {height: elHeight, width: elWidth});
            element.css({left, top});
            ctrl.onDrag({x, y});
        }

        function onDragEnd() {
            element.removeClass('drag-active').css({left: initX || 0, top: initY || 0});
            ctrl.onDragEnd(element, attrs.spgDraggable, scope.$eval(attrs.draggablePayload));
        }
    }
});

angular.module('munisSalesLink').directive('spgDraggable', ['$document', 'spgRx', 'spgDraggableService', DraggableDirective]);
