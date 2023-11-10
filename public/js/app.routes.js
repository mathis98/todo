angular.module("app.routes", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "../pages/Login.html",
				controller: 'AuthController',
				controllerAs: 'auth'
    })
    .when("/user", {
        templateUrl : "../pages/ToDo.html",
        controller : "TodoController"
    })

		// use the HTML5 History API
    $locationProvider.html5Mode(true);
});
