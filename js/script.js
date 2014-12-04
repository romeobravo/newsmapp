function flotChart() {
	console.log('hello');
}

function articleHighlight(article) {
	// var marker = $('circle[data-index=' + article + ']').get(0);	
	// markerEnter(marker, false);
}

function countryHighlight(countries) {
	map.clearSelectedRegions();
	map.setSelectedRegions(countries);
	//console.log(countries);
	if(Array.isArray(countries)) {
		if(countries.length > 0)
			map.setFocus({regions: countries, animate: true});
		else
			map.resetZoom();
	} else {
		map.setFocus({region: countries, animate: true});	
	}
}

function categoryShow(articles) {
	if(articles) {
		$('circle').each(function() {
			$(this).hide();
		});
		
		articles.forEach(function(article) {
			console.log(article._id);
			$('circle[data-index=' + article._id + ']').show();
		});
	} else {
		$('circle').each(function() {
			$(this).show();
		});		
	}
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
		categoryShow();
	});
});

newsApp.controller('aboutController', function($scope) {
	$scope.pageClass = 'page-about';
});

newsApp.controller('countryController', function($scope, $routeParams, myService) {
	myService.getCountry($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-country';
		$scope.articles = data;
		var code = $routeParams.param;
		lastCountry = code;
		$scope.code = code;
		$scope.country = map.mapData.paths[code].name;
		if(data.length > 0) {
			$scope.found = true;
		} else {
			$scope.found = false;
		}
		countryHighlight($routeParams.param);
		categoryShow();
	});
});

newsApp.controller('articleController', function($scope, $routeParams, myService) {
	myService.getArticle($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-article';
		$scope.article = data;
		$scope.code = data.country[0];
		$scope.country = map.mapData.paths[data.country[0]].name;
		countryHighlight(data.country);
		articleHighlight($routeParams.param);
		categoryShow();
	});
});

newsApp.controller('categoryController', function($scope, $routeParams, myService) {
	myService.getCategory($routeParams.param).then(function(data) {
		$scope.pageClass = 'page-category';
		if(data.length > 0) {
			$scope.found = true;
		} else {
			$scope.found = false;
		}
		$scope.articles = data;
		$scope.category = $routeParams.param;
		countryHighlight([]);
		categoryShow(data);
	});
});