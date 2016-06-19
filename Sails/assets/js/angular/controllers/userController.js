/* File for user related controllers:
	- UserController
	- LoginController
	- RegisterController
*/
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



// User Controller -> keeps user in correct template depending on user
myApp.controller('UserController', ['$scope', '$location', 'UserService', 'PostsService', function( $scope, $location, UserService, PostsService)
{
	$scope.user = UserService.Get();

	$scope.$watch(function () { return UserService.Get(); }, function (newVal, oldVal) 
	{
		if (!newVal)
		{
			$location.path('/login');
		}
		else if(!$scope.user)
		{
			PostsService.LoadFeedPage();
		}

		$scope.user = UserService.Get();
	});
}]);

// Login Controller
myApp.controller('LoginController', ['$scope', 'UserService', function( $scope, UserService )
{
	$scope.loginForm = {};

	this.Login = function()
	{
		// Check logged in
		if( UserService.Get() )
		{
			alert("Log out first!");
		}
		// Registration
		else
		{
			UserService.Login($scope.loginForm.login, $scope.loginForm.password);
			$scope.loginForm = {};
		}
	};

	this.Logout = function()
	{
		UserService.Logout();
	};
}]);

// LogOut Controller
myApp.controller('RegisterController', ['$scope', 'UserService', function( $scope, UserService )
{
	$scope.registerForm = {};

	this.Register = function()
	{
		// Check logged in
		if( UserService.Get() )
		{
			alert("Log out first!");
		}
		// Registration
		else
		{
			UserService.Register($scope.registerForm.profileName, $scope.registerForm.login, $scope.registerForm.password);
			$scope.registerForm = {};
		}
	};
}]);