/*@MODULE*/
interface $rxService {
	new<T>(fn: (observer: $rx.IObserver<T>) => void | Function): $rx.IObservable<T>;
	<T>(fn: (observer: $rx.IObserver<T>) => void | Function): $rx.IObservable<T>;
	/* Subject constructors */
	Subject: { new<T>(): $rx.ISubject<T> },
	BehaviorSubject: { new<T>(initialValue: T): $rx.ISubject<T> };
	ReplaySubject: { new<T>(count: number, timeWindow?: number): $rx.ISubject<T> };
	AsyncSubject: { new<T>(): $rx.ISubject<T> };
	/* Observable static methods */
	of<T>(...args: T[]): $rx.IObservable<T>;
	from<T>(iterable: any, selector?: (val: any, arg: any) => T): $rx.IObservable<T>;
	fromEvent<T>(target: $rx.IEventTarget, evtName: string, options?: any, selector?: (...args: any[]) => T): $rx.IObservable<T>;
	fromEventPattern<T>(addHandler: (handler: any) => any, removeHandler?: (handler?: any) => any, selector?: (...args: any[]) => T): $rx.IObservable<T>;
	fromPromise<T>(promise: Promise<T> | angular.IPromise<T>): $rx.IObservable<T>;
	fromEntries<S>(obj: S): $rx.IObservable<[string, any]>;
	pairs<S>(obj: S): $rx.IObservable<[string, any]>;
	return<T>(val: T): $rx.IObservable<T>;
	throw<T>(err: Error): $rx.IObservable<T>;
	empty<T>(): $rx.IObservable<T>;
	never<T>(): $rx.IObservable<T>;
	if<T>(predicate: () => boolean, whenTrue: $rx.IObservable<T>, whenFalse?: $rx.IObservable<T>): $rx.IObservable<T>;
	case<T>(keySelector: () => string, sources: Dictionary<$rx.IObservable<T>>, defaultSrc?: $rx.IObservable<T>): $rx.IObservable<T>;
	interval(period: number): $rx.IObservable<number>;
	timer(delay: number | Date, period?: number): $rx.IObservable<number>;
	start<T>(selector: () => T, context?: Object): $rx.IObservable<T>;
	startAsync<T>(asyncSelector: () => Promise<T> | angular.IPromise<T>): $rx.IObservable<T>;
	repeat<T>(val: T, count: number): $rx.IObservable<T>;
	while<T>(predicate: () => boolean, obs: $rx.IObservable<T>): $rx.IObservable<T>;
	range(start?: number, count?: number): $rx.IObservable<number>;
	combineLatest<T>(observables: $rx.IObservable<any>[], projector: (...args: any[]) => T): $rx.IObservable<T>;
	combineLatest<T>(...observablesOrProjector: ($rx.IObservable<any> | Function)[]): $rx.IObservable<T>;
	merge<T>(...observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	mergeDelayError<T>(...observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	zip<T>(observables: $rx.IObservable<any>[], projector: (...args: any[]) => T): $rx.IObservable<T>;
	zip<T>(...observablesOrProjector: ($rx.IObservable<any> | Function)[]): $rx.IObservable<T>;
	forkJoin<T>(observables: $rx.IObservable<any>[], projector: (...args: any[]) => T): $rx.IObservable<T>;
	forkJoin<T>(...observablesOrProjector: ($rx.IObservable<any> | Function)[]): $rx.IObservable<T>;
	when<T>(pattern: $rx.IPattern<T>): $rx.IObservable<T>;
	concat<T>(...observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	amb<T>(...observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	for<T>(sources: any[], selector: (e: any, index?: number, observable?: $rx.IObservable<any>) => $rx.IObservable<T>, context: Object): $rx.IObservable<T>;
	catch<T>(observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	catch<T>(...observables: $rx.IObservable<T>[]): $rx.IObservable<T>;
	using<T, S>(resourceFactory: () => $rx.IDisposableResource<S>, observableFactory: (resource: $rx.IDisposableResource<S>) => $rx.IObservable<T>): $rx.IObservable<T>;
	isObservable(value: any): boolean;
	/* Custom utils/extensions */
	$watch<T>($scope: angular.IScope, watchExpression: string | Function, objectEquality?: boolean): $rx.IObservable<T>;
	$observeAttrs<T>($attrs: angular.IAttributes, key: string): $rx.IObservable<T>;
	fromSlickEvent<T>(gridEvent: Slick.Event<T>): $rx.IObservable<T>;
	fromScopeEvent<T>($scope: angular.IScope, evtName: string): $rx.IObservable<T>;
	fromLightstreamer<T>(lightsteamer: LightstreamerHelper): $rx.IObservable<T>;
}


/* DECORATOR / PROXY FOR RxJs
*   -Provides shorthand methods that delegates to Rx static methods
*   -Adds additional utility methods to facilitate smooth inter-op between Rx and other app libraries/frameworks (ie Angular and SlickGrid)
*   -Analogous to $q's relationship to Promise API
* */
const $rxUtils = (rx: any) => {
	const {Subject, BehaviorSubject, ReplaySubject, AsyncSubject, Observable} = rx;

	/* FUNCTION: Wrapper for Observable.create */
	const $rx = Observable.create;

	/* SUBJECTS: Alias to Rx Subjects */
	$rx.Subject = Subject;
	$rx.BehaviorSubject = BehaviorSubject;
	$rx.ReplaySubject = ReplaySubject;
	$rx.AsyncSubject = AsyncSubject;

	/* STATIC OPERATORS: Shorthands for static methods on Rx.Observable */
	//Creational operators
	$rx.of = Observable.of;
	$rx.from = Observable.from;
	$rx.fromEvent = Observable.fromEvent;
	$rx.fromEventPattern = Observable.fromEventPattern;
	$rx.fromPromise = Observable.fromPromise;
	$rx.fromEntries = $rx.pairs = Observable.pairs;
	$rx.return = Observable.return;
	$rx.throw = Observable.throw;
	$rx.empty = Observable.empty;
	$rx.never = Observable.never;
	$rx.case = Observable.case;
	$rx.if = Observable.if;
	$rx.interval = Observable.interval;
	$rx.timer = Observable.timer;
	$rx.start = Observable.start;
	$rx.startAsync = Observable.startAsync;
	$rx.repeat = Observable.repeat;
	$rx.while = Observable.while;
	$rx.range = Observable.range;

	//Combinational operators
	$rx.combineLatest = Observable.combineLatest;
	$rx.forkJoin = Observable.forkJoin;
	$rx.merge = Observable.merge;
	$rx.mergeDelayError = Observable.mergeDelayError;
	$rx.zip = Observable.zip;
	$rx.when = Observable.when;

	//Mathematical and aggregational operators
	$rx.concat = Observable.concat;

	//Conditional and boolean operators
	$rx.amb = Observable.amb;

	//Transformational operators
	$rx.for = Observable.for;

	//Error handling operators
	$rx.catch = Observable.catch;

	//Util methods
	$rx.isObservable = Observable.isObservable;
	$rx.using = Observable.using;

	/* ANGULAR UTILS: Angular specific helpers */
	//Turns a $scope.$watch into an Observable
	$rx.$watch = ($scope, watchExpression, objectEquality) => Observable.create(observer => {
		return $scope.$watch(watchExpression, val => observer.onNext(val), objectEquality);
	});

	//Turns a $attrs.$observe into an Observable
	$rx.$observeAttrs = ($attrs, key) => Observable.create(observer => {
		return $attrs.$observe(key, val => observer.onNext(val));
	});

	/* EVENT UTILS: Event helpers for transforming other library (ie: Angular, SlickGrid, Lightstreamer) events into Observables */
	//Wraps Slick event into Observable
	$rx.fromSlickEvent = gridEvent => Observable.fromEventPattern(
	  handler => gridEvent.subscribe(handler), handler => gridEvent.unsubscribe(handler), (evt, payload) => ({evt, payload})
	);

	//Wraps $scope event into Observable
	$rx.fromScopeEvent = ($scope, evtName) => {
		let unSub;
		return Observable.fromEventPattern(
		  handler => unSub = $scope.$on(evtName, handler),
		  () => unSub(),
		  (evt, payload) => ({evt, payload})
		);
	};

	//Wraps a Lightstreamer subscription into Obsersvable
	$rx.fromLightstreamer = lightstreamer => {
		let lsSub;
		return Observable.fromEventPattern(
		  handler => lsSub = lightstreamer.subscribe(handler),
		  () => lsSub.then(sub => lightstreamer.unsubscribe(sub))
		);
	};

	return $rx;
};

angular.module('myModule').factory('$rx', ['rx', $rxUtils]);
