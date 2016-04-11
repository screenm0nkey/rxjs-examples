ANGULAR

#does angular support valid namespacing?
No. there is one injector per app and services with the same name override each other

#types of services
constant
value
service
factory
provider (provider can be configured in app.config)


#explain what scope and rootscope are
$rootScope is the parent object of all $scope Angular objects created in a web page.


#What are the ways to communicate between modules of your application using core AngularJS functionality? Name three ways.
Using services
Using events
Using $scope.apply() to call methods on scopes further up the chain (bad)
By assigning models on $rootScope (bad);
Directly between controllers, using $parent, nextSibling, (bad)
Directly between controllers, using ControllerAs, "require"


#Tell me whats new in Angular 1.5
Component definition
Multiple slot transclusion
ng-animate-swap (rotating banner)
Lazy transclusion (performance boost)



#When a scope is terminated,two events are emitted. name them.
scope.$on(‘$destroy’);
element.on(‘$destroy’);


#how to remove a watch
var deregisterWatchFn = $rootScope.$watch()
deregisterWatchFn()


#What are the phases of a directive
First, the “$compile()” function is executed which returns two link functions, preLink and postLink. That function is executed for every directive, starting from parent, then child, then grandchild.
You almost never need to use the prelink.
Secondly, two functions are executed for every directive: the controller and the prelink function. The order of execution again starts with the parent element, then child, then grandchild, etc.
The last function postLink (or link)is executed in the inverse order. That is, it is first executed for grandchild, then child, then parent.


#Explain the differences
The compile function allows the directive to manipulate the DOM before it is compiled and linked thereby allowing it to add/remove/change directives, as well as, add/remove/change other DOM elements.
The controller function facilitates directive communication. Sibling and child directives can request the controller of their siblings and parents to communicate information.
The pre-link function allows for private $scope manipulation before the post-link process begins.
The post-link (or just link) method is the primary workhorse method of the directive.




#what's is the digest loop. how does it work?
In a nutshell, on every dom event the digest cycle all scope models are compared against their previous values. 
That is dirty checking. If change is detected, the watches set on that model are fired. 
Then another digest cycle executes, and so on until all models are stable.


#whats the difference betwween $digest and $apply.
When $scope.$apply() is called, it kicks the entire application into the $digest loop and in turn runs $rootScope.$digest();
$scope.$digest, which runs the exact same $digest loop, but is executed from the current $scope downwards through its children, a much less costly venture.



#how to speed up angular app
$compileProvider.debugInfoEnabled(false);
$httpProvider.useApplyAsync(true);
Reduced watchers
One-time binding syntax {{ ::value }}
$scope.$apply() versus $scope.$digest()
Avoid ng-repeat where possible;
Limit DOM filters or use stateless filters
Reduce data with limitTo (pagination)


#watch vs observe
