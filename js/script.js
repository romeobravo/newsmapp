// create the module and name it newsApp
    // also include ngRoute for all our routing needs
var newsApp = angular.module('newsApp', ['ngRoute', 'ngAnimate']);

newsApp.factory('serviceId', function() {
  var shinyNewServiceInstance;
  // factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});

newsApp.factory('myService', function($http) {
	return {
		getFoos: function(post_id) {
			//return the promise directly.
			return $http.get('/api/post/' + post_id)
			.then(function(result) {
				//resolve the promise as the data
				return result.data;
			});
		}
	}
});

// configure our routes
newsApp.config(function($routeProvider) {
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the about page
		.when('/about', {
			templateUrl : 'pages/about.html',
			controller  : 'aboutController'
		})

		.when('/country/:param', {
			templateUrl : 'pages/country.html',
			controller  : 'countryController'
		})

		.when('/article/:param/:param2', {
			templateUrl : 'pages/article.html',
			controller  : 'articleController'
		});
});


// create the controller and inject Angular's $scope
newsApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.pageClass = 'page-home';
	$scope.obj = { 'hello': 'aiaiaiai' };
});

newsApp.controller('aboutController', function($scope) {
	$scope.pageClass = 'page-about';
});

newsApp.controller('countryController', function($scope, $routeParams) {
	$scope.pageClass = 'page-country';
	$scope.country = $routeParams.param;
});

newsApp.controller('articleController', function($scope, $routeParams, myService) {
	myService.getFoos($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-article';
		$scope.article = data;
	});
});
