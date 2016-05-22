
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
myApp.factory('UserService', function($http)
{
	var user = {};

	return {
		// Log in with password
		'Login' : function(login, password)
		{
			$http.post('/user/Authenticate', {
				'login': login, 
				'password': password
			}).then(
				// Success
				function(response)
				{
					user = response.data;

					if(false)
					{
						alert("Wrong login or password.");
					}
				},
				// Error
				function(response)
				{
					alert('Could not authenticate on server.');
				}
			);
/*
			user = $http.get('/user/Authenticate', login, password);
			if(typeof user === 'undefined' || typeof user.id === 'undefined')
			{
				user = {};
				return true;
			}
			return false;
/*			OLD
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
*/
		},

		// Logout
		'Logout' : function()
		{
			user = {};
		},

		// Register
		'Register' : function(profileName, login, password)
		{
			$http.post('/user/Register', {
				'profileName': profileName, 
				'login': login, 
				'password': password
			}).then(
				// Success
				function(response)
				{
					user = response.data;

					if(false)
					{
						alert("User name already in use.");
					}
				},
				// Error
				function(response)
				{
					alert('Could not register on server.');
				}
			);
		},

		// Get the currently logged user
		'Get' : function()
		{
			if(typeof user === 'undefined' || typeof user.id === 'undefined')
				return false;
			else
				return user;
		}
	};
});

// Redirect controller
myApp.controller('RedirectController', ['$scope', '$location', 'UserService', function( $scope, $location, UserService)
{
	this.ToMyPosts = function()
	{
		if(UserService.Get())
			$location.path('/myposts');
		else
			console.log('Invalid redirect attempt');

	}
	this.ToMyGroups = function()
	{
		if(UserService.Get())
			$location.path('/groups');
		else
			console.log('Invalid redirect attempt');
	}
	this.ToMyFeed = function()
	{
		if(UserService.Get())
			$location.path('/feed');
		else
			console.log('Invalid redirect attempt');
	}
	this.ToMyProfile = function()
	{
		if(UserService.Get())
			$location.path('/profile');
		else
			console.log('Invalid redirect attempt');
	}
}]);

// User Controller
myApp.controller('UserController', ['$scope', '$location', 'UserService', function( $scope, $location, UserService )
{
	$scope.user = UserService.Get();

	$scope.$watch(function () { return UserService.Get() }, function (newVal, oldVal) 
	{
		$scope.user = UserService.Get();

		if (typeof newVal === 'undefined' || typeof newVal.id === 'undefined')
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
		// Check logged in
		if( UserService.Get() )
		{
			alert("Log out first!");
		}
		// Registration
		else
		{
			UserService.Authenticate($scope.registerForm.login, $scope.registerForm.password);
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



///////////
// POSTS //
///////////


// Post Create/Load Service
myApp.factory('PostsService', ['UserService', function(UserService)
{
	var viewingPosts = [{
		'writer': {
			'id' : 0,
			'profileName': 'Andy',
			'picturePath' : 'Uploads/profile-picture.jpg'
		},
		'date': '11-11-1111',
		'content': 'Lorem Ipsum.',
		'comments': [{
			'writer': {
				'id' : 0,
				'profileName': 'Andy',
				'picturePath' : 'Uploads/profile-picture.jpg'
			},
			'content': 'Lorem Ipsum.',
			'date': '11-11-1111'
		}],
		'likes': 6,
		'dislikes': 42,
		'userLikes': false,
		'userDislikes': false
	}];

	return {
		// Retrieve posts stored in service
		'Get' : function()
		{
			return viewingPosts;
		},
		// Create new post
		'Create' : function()
		{
			var user = UserService.Get();

			if(user)
			{
				var newPost = {
					'writer': user,
					'date': '11-11-1111',
					'content': 'Lorem Ipsum.',
					'comments': [],
					'likes': 0,
					'dislikes': 0,
					'userLikes': false,
					'userDislikes': false
				};
			}
			else
			{
				console.log('Invalid operation: can not post if not logged in.');
			}
		},
		// Share
		'Share' : function(postIdx)
		{

		},
		// Like
		'Like' : function(postIdx)
		{
			if(viewingPosts[postIdx].userLikes)
			{
				viewingPosts[postIdx].userLikes = false;
				viewingPosts[postIdx].likes--;
			}
			else
			{
				viewingPosts[postIdx].userLikes = true;
				viewingPosts[postIdx].likes++;
				if(viewingPosts[postIdx].userDislikes)
				{
					viewingPosts[postIdx].userDislikes = false;
					viewingPosts[postIdx].dislikes--;
				}
			}
		},
		// UnLike
		'Dislike' : function(postIdx)
		{						
			if(viewingPosts[postIdx].userDislikes)
			{
				viewingPosts[postIdx].userDislikes = false;
				viewingPosts[postIdx].dislikes--;
			}
			else
			{
				viewingPosts[postIdx].userDislikes = true;
				viewingPosts[postIdx].dislikes++;
				if(viewingPosts[postIdx].userLikes)
				{
					viewingPosts[postIdx].userLikes = false;
					viewingPosts[postIdx].likes--;
				}
			}
		}

	}
}]);

// LogOut Controller
myApp.controller('PostReadController', ['$scope', 'PostsService', function( $scope, PostsService )
{
	$scope.viewingPosts = PostsService.Get();

	this.Like = function(postIdx)
	{
		PostsService.Like(postIdx);
	}

	this.Dislike = function(postIdx)
	{
		PostsService.Dislike(postIdx);
	}
}]);
