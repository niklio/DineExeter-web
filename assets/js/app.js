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

app.controller('FoodController', function FoodController($scope, $http) {
	$scope.iselm = true;
	$scope.$watch('iselm', function() {
		$scope.items = null;
		$http.get(root + '/api/foods?mealday=' + currentMeal(0) + '&iselm=' + $scope.iselm)
		.then(function(resp) {
			$scope.items = resp.data
			console.log($scope.items)
		}, function(err) {
			console.error('Error: ', err);
		})
	})
});