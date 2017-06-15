/*@MODULE*/
class SplitterBarController implements  angular.IComponentController {
	static $inject = [ '$scope', '$element', '$document', 'spgRx' ];

	/*BINDINGS*/
	notifier: SpgRx.ISubject<Splitter.Position>;
	isVertical: boolean;
	index: number;
	onDragBegin: () => void;
	onDragMove: (params: {coords: Splitter.Coord, index: number}) => number;
	onDragComplete: () => void;

	domInputs: SpgRx.ISubscription<{x: number, y: number}>;
	max: boolean;

	private pSizeBounds: [number, number];

	constructor(
	  private $scope: angular.IScope,
	  private $element: angular.IRootElementService,
	  private $document: angular.IDocumentService,
	  private rx: SpgRxService
	) {}

	get sizeBounds(): [number, number] {
		return this.pSizeBounds || (this.pSizeBounds = this.isVertical ? [2, 86] : [1, 98]);
	}

	$postLink() {
		//Subscribe to the 'mousedown' event
		this.domInputs = this.rx.fromEvent(this.$element, 'mousedown')
		  //We dont want multiple clicks within short timeframe to interrupt
		  .throttle(25)
		  //Notify parent that a drag has started
		  .do(() => this.onDragBegin())
		  //Switch subscription to the 'mousemove' event
		  .flatMapLatest(() => this.rx
		    .fromEvent(this.$document, 'mousemove')
		      //Unsubscribe if there is a 'mouseup' event or if there is a position notification from the container
		      .takeUntil(this.rx.using(
		        () => ({dispose: () => this.onDragComplete()}),
		        () => this.rx.merge(this.rx.fromEvent(this.$document, 'mouseup'), this.notifier.asObservable().filter(val => !!val))
		      ))
		  )
		  //Throttle by 15ms
		  .sample(15)
		  //Get the current x and y position
		  .map(({ pageX, pageY }) => ({x: pageX, y: pageY}))
		  //Notify the parent
		  .subscribe(coords => {
			  let pctSize = this.onDragMove({coords, index: this.index});
			  let [ min, max ] = this.sizeBounds;
			  this.max = pctSize > max || pctSize < min;
		  });
	}

	$onDestroy() {
		this.domInputs && this.domInputs.dispose();
	}
}

const SplitterBarComponent: angular.IComponentOptions = {
	controller: SplitterBarController,
	bindings: {
		notifier: '<',
		isVertical: '<',
		index: '<',
		onDragBegin: '&',
		onDragMove: '&',
		onDragComplete: '&'
	},
	template:
		`<div class="splitter" ng-class="$ctrl.isVertical ? 'vertical' : 'horizontal'">
			<span class="resize-arrow resize-up-left" ng-class="{ max: vm.max || vm.isLeft }">
				<i class="grip"></i>
			</span>
		</div>`
};

angular.module('munisSalesLink').component('splitterBarComponent', SplitterBarComponent);



