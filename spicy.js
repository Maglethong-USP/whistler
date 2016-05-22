(
	function(angular) 
	{
		'use strict';
		var myApp = angular.module('spicyApp', ['ngRoute']);
		

		// Route Provider
		myApp.config(function ($routeProvider, $locationProvider) 
		{
			$routeProvider.when('/', {
				redirectTo: '/login'
			}).when('/login', {
				templateUrl: 'templates/login.html',
				controller: 'UserController'
			}).when('/feed', {
				templateUrl: 'templates/feed.html',
				controller: 'UserController'
			});
		});

		// User Login/Logout/Register Service
		myApp.factory('UserService', function()
		{
			// TODO [Server side]
			var userList = [];


			var user = {};

			return {
				// Log in with password
				'Login' : function(login, password)
				{
					for(var i = userList.length -1; i>=0; i--)
						if(userList[i].login === login)
						{
							if(userList[i].password === password)
							{
								user = userList[i];
								return false
							}
							return true;
						}
					return true;
				},

				// Logout
				'Logout' : function()
				{
					user = {};
				},

				// Register
				'Register' : function(profileName, login, password)
				{
					for(var i = userList.length -1; i>=0; i--)
						if(userList[i].login === login)
						{
							return true;
						}

					var newUser = {
						'profileName': profileName,
						'login': login,
						'password': password,
						'picturePath' : 'profile-picture.jpg'
					};

					userList.push(newUser);
					user = newUser;
					return false;
				},

				// Get the currently logged user
				'Get' : function()
				{
					return user;
				}
			};
		});

		// Redirect controller
		myApp.controller('RedirectController', ['$scope', '$location', 'UserService', function( $scope, $location, UserService)
		{
			this.ToMyPosts = function()
			{
				var user = UserService.Get();
				if(typeof user === 'undefined' || typeof user.login === 'undefined')
					console.log('Invalid redirect attempt');
				else
					$location.path('/myposts');
			}
			this.ToMyGroups = function()
			{
				var user = UserService.Get();
				if(typeof user === 'undefined' || typeof user.login === 'undefined')
					console.log('Invalid redirect attempt');
				else
					$location.path('/groups');
			}
			this.ToMyFeed = function()
			{
				var user = UserService.Get();
				if(typeof user === 'undefined' || typeof user.login === 'undefined')
					console.log('Invalid redirect attempt');
				else
					$location.path('/feed');
			}
			this.ToMyProfile = function()
			{
				var user = UserService.Get();
				if(typeof user === 'undefined' || typeof user.login === 'undefined')
					console.log('Invalid redirect attempt');
				else
					$location.path('/profile');
			}
		}]);

		// User Controller
		myApp.controller('UserController', ['$scope', '$location', 'UserService', function( $scope, $location, UserService )
		{
			$scope.user = UserService.Get();

			$scope.$watch(function () { return UserService.Get() }, function (newVal, oldVal) 
			{
				$scope.user = UserService.Get();

				if (typeof newVal === 'undefined' || typeof newVal.login === 'undefined')
				{
					$location.path('/login');
				}
				else
				{
					$location.path('/feed');
				}

			});
		}]);

		// Login Controller
		myApp.controller('LoginController', ['$scope', 'UserService', function( $scope, UserService )
		{
			$scope.loginForm = {};

			this.Login = function()
			{
				if( UserService.Login($scope.loginForm.login, $scope.loginForm.password) )
				{
					$scope.loginForm.password = '';
					alert("Wrong login or password.");
				}
				else
				{
					$scope.loginForm = {};
				}

				// TODO [When joining server:]
			/*	UserService.Login(login, password).then(
					// Success
					function(response)
					{

					},
					// Error
					function(response)
					{

					}
				);*/
			};

			this.Logout = function()
			{
				UserService.Logout();

				// TODO [When joining server:]
			/*	UserService.Logout().then(
					// Success
					function(response)
					{

					},
					// Error
					function(response)
					{

					}
				);*/
			};
		}]);

		// LogOut Controller
		myApp.controller('RegisterController', ['$scope', 'UserService', function( $scope, UserService )
		{
			$scope.registerForm = {};

			this.Register = function()
			{
				if( UserService.Register($scope.registerForm.profileName, $scope.registerForm.login, $scope.registerForm.password) )
				{
					$scope.registerForm.login = '';
					alert("Login name already in use.");
				}
				else
				{
					$scope.registerForm = {};
				}

				// TODO [When joining server:]
			/*	UserService.Register(profileName, login, password).then(
					// Success
					function(response)
					{

					},
					// Error
					function(response)
					{

					}
				);*/
			};
		}]);
	}
)
(window.angular);
