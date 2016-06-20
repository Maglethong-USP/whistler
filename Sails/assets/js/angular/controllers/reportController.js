/*
	SCC0219 - Project Whistler

	Group:
		- Rafael Gallo
		- Andreas Munte
		- Guilherme Muzzi


	TODO [Description]
*/

// Fetching module reference
var myApp = angular.module('spicyApp');


// Report Visualization Controller
myApp.controller('ReportVisualizationController', ['$scope', '$http', function($scope, $http)
{
	this.visibleReport = 0;

	this.isActive = function(index)
	{
		return (index === this.visibleReport);
	}
	this.setActive = function(index)
	{
		this.visibleReport = index;
	}
}]);

// User Report controller
myApp.controller('Top20UserReportController', ['$scope', '$http', function($scope, $http)
{
	$scope.timeDeltaForm = {};
	$scope.top20Users = [];

	this.LoadReport = function()
	{
		// TODO [check dates are valid?]

		$http.post('/reports/GetTop20Users', {
			'start': $scope.timeDeltaForm.start,
			'end': $scope.timeDeltaForm.end
		}).then(
			// Success
			function(response)
			{
				$scope.top20Users = response.data;
				$scope.timeDeltaForm = {};

				// TODO [check response is good]

				console.log("Report Result:"); // TODO [Debug]
				for(var i=0; i<$scope.top20Users.length; i++)
					console.log($scope.top20Users[i]);
			},
			// Error
			function(response)
			{
				alert('Server communication error.');
			}
		);
	}
}]);

// User Report controller
myApp.controller('Top20PostsReportController', ['$scope', '$http', function($scope, $http)
{
	$scope.timeDeltaForm = {};
	$scope.top20Posts = [];

	this.LoadReport = function()
	{
		// TODO [check dates are valid?]

		$http.post('/reports/GetTop20Posts', {
			'start': $scope.timeDeltaForm.start,
			'end': $scope.timeDeltaForm.end
		}).then(
			// Success
			function(response)
			{
				$scope.top20Users = response.data;
				$scope.timeDeltaForm = {};

				// TODO [check response is good]
				
				console.log("Report Result:"); // TODO [Debug]
				for(var i=0; i<$scope.top20Users.length; i++)
					console.log($scope.top20Users[i]);
			},
			// Error
			function(response)
			{
				alert('Server communication error.');
			}
		);
	}
}]);