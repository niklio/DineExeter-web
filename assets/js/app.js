var root = 'http://localhost:3000';

function currentMeal(fromMeal) {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		meals = ['Breakfast', 'Lunch', 'Dinner'],

		d = new Date(),
		day = d.getDay(),
		hour = d.getHours();

	if(hour > 18 || (hour < 8 || (hour) < 12 && day==0)) meal = 0;
	else if(hour > 8 && hour < 12) meal = 1;
	else meal = 2;

	day += Math.floor((meal + fromMeal)/3)

	return meals[(meal + fromMeal) % 3] + days[day];
}


var app = angular.module('dineexeter', []);

var cache = null

app.controller('FoodController', function FoodController($scope, $http, $timeout) {
	$scope.iselm = true;
	$scope.fromMeal = 0;

	$scope.$watchGroup(['fromMeal', 'iselm'], function() {
		$scope.items = null;

		var now = new Date();
		$http.get(root + '/api/foods?mealday=' + currentMeal($scope.fromMeal) + '&iselm=' + $scope.iselm)
		.then(function(resp) {
			$timeout(function() {
				if ( cache != null ) {
					var temp = $scope.items
					$scope.items = cache
					cache = temp
				} else {
					$scope.items = resp.data
				}
			}, 500 - ((new Date()).getTime() - now.getTime()));
			
		}, function(err) {
			console.error('Error: ', err);
		})
	})


	$(".swipeWrapper").swipe({
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			$scope.$apply(function() {
				if (direction == 'right' && $scope.fromMeal > 0) $scope.fromMeal--
				else if (direction == 'left') $scope.fromMeal++
			});
		}
	});


	$scope.vote = null
	$scope.castvote = function($event, id, direction) {
		$http.post(root + '/api/vote/' + id, { upvote: direction })
			.success(function(data, status, headers, config) {
				showvote(direction, $event.target)
			})
			.error(function(data, status, headers, config) {
				console.error('Error: ', err);
			});
	}

	function showvote(direction, element) {
		if ( direction ) {
			$(element).parent().empty().addClass('upvoted')
		} else {
			$(element).parent().empty().addClass('downvoted')
		}
	}
});