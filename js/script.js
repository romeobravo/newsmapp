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
		},
		getCountry: function(country) {
			//return the promise directly.
			return $http.get('/api/post/country/' + country)
			.then(function(result) {
				//resolve the promise as the data
				return result.data;
			});
		},
		getAll: function(country) {
			//return the promise directly.
			return $http.get('/api/post/all')
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
newsApp.controller('mainController', function($scope, myService) {
	myService.getAll().then(function(data) {
		$scope.articles = data;
		$scope.pageClass = 'page-home';
	});
});

newsApp.controller('aboutController', function($scope) {
	$scope.pageClass = 'page-about';
});

newsApp.controller('countryController', function($scope, $routeParams, myService) {
	myService.getCountry($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-country';
		$scope.articles = data;
		$scope.country = $routeParams.param;
	});
});

newsApp.controller('articleController', function($scope, $routeParams, myService) {
	myService.getFoos($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-article';
		$scope.article = data;
	});
});
