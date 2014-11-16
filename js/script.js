function flotChart() {
	console.log('hello');
}

function countryHighlight(countries) {
	map.clearSelectedRegions();
	map.setSelectedRegions(countries);
//	map.setFocus({regions: countries, animate: "true"});
}

// create the module and name it newsApp
    // also include ngRoute for all our routing needs
var newsApp = angular.module('newsApp', 
	['ngRoute', 'ngAnimate']
);

newsApp.factory('serviceId', function() {
	var shinyNewServiceInstance;
	// factory function body that constructs shinyNewServiceInstance
	return shinyNewServiceInstance;
});

newsApp.factory('myService', function($http) {
	return {
		getArticle: function(post_id) {
			//return the promise directly.
			return $http.get('/api/post/' + post_id)
			.then(function(result) {
				//resolve the promise as the data
				return result.data;
			});
		},
		getCategory: function(category) {
			//return the promise directly.
			return $http.get('/api/post/category/' + category)
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
		})

		.when('/category/:param', {
			templateUrl : 'pages/category.html',
			controller  : 'categoryController'
		});
});


// create the controller and inject Angular's $scope
newsApp.controller('mainController', function($scope, myService) {
	myService.getAll().then(function(data) {
		$scope.articles = data;
		$scope.pageClass = 'page-home';
		if(data.length > 0) {
			$scope.found = true;
		} else {
			$scope.found = false;
		}
		countryHighlight([]);
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
		if(data.length > 0) {
			$scope.found = true;
		} else {
			$scope.found = false;
		}
		countryHighlight($routeParams.param);
	});
});

newsApp.controller('articleController', function($scope, $routeParams, myService) {
	myService.getArticle($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-article';
		$scope.article = data;
		countryHighlight(data.country);
	});
});

newsApp.controller('categoryController', function($scope, $routeParams, myService) {
	myService.getCategory($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-category';
		console.log(data);
		if(data.length > 0) {
			$scope.found = true;
		} else {
			$scope.found = false;
		}
		console.log($scope.found);
		$scope.articles = data;
		$scope.category = $routeParams.param;
		countryHighlight([]);
	});
});