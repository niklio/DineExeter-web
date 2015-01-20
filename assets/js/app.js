var root = 'http://localhost:3000';

var app = angular.module('dineexeter', []);

app.controller('FoodController', function FoodController($scope, $http) {
	$scope.items = null;
	$http.get(root + '/api/foods?')
		.then(function(resp) {
			$scope.items = resp.data
		}, function(err) {
			console.error('Error: ', err);
		})
});