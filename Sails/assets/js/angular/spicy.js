
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
myApp.factory('UserService', ['$http', function($http)
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
}]);

// User Controller -> keeps user in correct template depending on user
myApp.controller('UserController', ['$scope', '$location', 'UserService', 'PostsService', function( $scope, $location, UserService, PostsService)
{
	$scope.user = UserService.Get();

	$scope.$watch(function () { return UserService.Get(); }, function (newVal, oldVal) 
	{
		$scope.user = UserService.Get();

		if (typeof newVal === 'undefined' || typeof newVal.id === 'undefined')
		{
			$location.path('/login');
		}
		else
		{
			PostsService.LoadFeedPage();
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



///////////
// POSTS //
///////////


// Post Create/Load Service
myApp.factory('PostsService', ['UserService', '$http', '$location', function(UserService, $http, $location)
{
	var viewingPosts = [];
	var observerCallbacks = []; // $watch wasn't working properly

	// Notification call
	var notifyObservers = function()
	{
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

	var LoadComments = function(postIdx)
	{
		

		$http.post('/comment/GetComment', {
			'postid': viewingPosts[postIdx].id
		}).then(
			// Success
			function(response)
			{
				viewingPosts[postIdx].comments = response.data;
				notifyObservers();
			},
			// Error
			function(response)
			{
				//alert('Could not load comments from server.');
				console.log('Could not load comments from server.');
			}
		);
	}

	return {
		// Register observer
		'RegisterObserverCallback' : function(callback){
			observerCallbacks.push(callback);
		},
		// Retrieve posts stored in service
		'Get' : function()
		{
			return viewingPosts;
		},
		// Create new post
		'Create' : function(content)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/post/Create', {
					'writer': user.id,
					'content': content
				}).then(
					// Success
					function(response)
					{
						// TODO [push new post into viewingPosts and call callbacks]
					},
					// Error
					function(response)
					{
						alert('Could not Create post on server.');
					}
				);
			}
			else
			{
				console.log('Invalid operation: can not post if not logged in.');
			}
		},
		// Load feed posts
		'LoadFeedPage' : function()
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/post/GetFeed', {'userid': user.id}).then(
					// Success
					function(response)
					{	
						viewingPosts = response.data;
						notifyObservers();
						$location.path('/feed');

						for(var i=0; i<viewingPosts.length; i++)
						{
							console.log(viewingPosts[i].commentCount + '(' + i + ' )');
							if(viewingPosts[i].commentCount > 0)
								LoadComments(i);
						}
					},
					// Error
					function(response)
					{
						alert('Could not load feed posts from server.');
					}
				);
			}
			else
			{
				console.log('Invalid operation: can not post if not logged in.');
			}
		},
		// Search for posts
		'LoadSearchPage' : function(searchString)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/post/Search', 
				{
					'userid': user.id,
					'searchString': searchString
				}).then(
					// Success
					function(response)
					{	
						viewingPosts = response.data;
						notifyObservers();
						$location.path('/feed'); // TODO [change location]
					},
					// Error
					function(response)
					{
						alert('Could not complete search.');
					}
				);
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
			var user = UserService.Get();
			var rankInfo = {
				'post': viewingPosts[postIdx].id,
				'ranker': user.id
			}

			// User already likes
			if(viewingPosts[postIdx].userLikes)
			{
				console.log(rankInfo);
				$http.post('/rank/UnUpvote', rankInfo).then(
					// Success
					function(response)
					{
						if(response.data !== '')
						{
							viewingPosts[postIdx].userLikes = false;
							viewingPosts[postIdx].likes--;
						}
					},
					// Error
					function(response){ alert('Could UnUpvote post on server.'); }
				);
			}
			// User does not already like
			else
			{
				// User dislikes
				if(viewingPosts[postIdx].userDislikes)
				{
					$http.post('/rank/UnDownvote', rankInfo).then(
						// Success
						function(response)
						{
							if(response.data !== '')
							{
								viewingPosts[postIdx].userDislikes = false;
								viewingPosts[postIdx].dislikes--;
							}
						},
						// Error
						function(response){ alert('Could UnDownvote post on server.'); }
					);
				}

				$http.post('/rank/Upvote', rankInfo).then(
					// Success
					function(response)
					{
						if(response.data !== '')
						{
							viewingPosts[postIdx].userLikes = true;
							viewingPosts[postIdx].likes++;
						}
					},
					// Error
					function(response){ alert('Could Upvote post on server.'); }
				);
			}
		},
		// UnLike
		'Dislike' : function(postIdx)
		{
			var user = UserService.Get();
			var rankInfo = {
				'post': viewingPosts[postIdx].id,
				'ranker': user.id
			}

			// User already dislikes
			if(viewingPosts[postIdx].userDislikes)
			{
				$http.post('/rank/UnDownvote', rankInfo).then(
					// Success
					function(response)
					{
						if(response.data !== '')
						{
							viewingPosts[postIdx].userDislikes = false;
							viewingPosts[postIdx].dislikes--;
						}
					},
					// Error
					function(response){ alert('Could UnUpvote post on server.'); }
				);
			}
			// User does not already like
			else
			{
				// User likes
				if(viewingPosts[postIdx].userLikes)
				{
					$http.post('/rank/UnUpvote', rankInfo).then(
						// Success
						function(response)
						{
							if(response.data !== '')
							{
								viewingPosts[postIdx].userLikes = false;
								viewingPosts[postIdx].likes--;
							}
						},
						// Error
						function(response){ alert('Could UnDownvote post on server.'); }
					);
				}

				$http.post('/rank/Downvote', rankInfo).then(
					// Success
					function(response)
					{
						if(response.data !== '')
						{
							viewingPosts[postIdx].userDislikes = true;
							viewingPosts[postIdx].dislikes++;
						}
					},
					// Error
					function(response){ alert('Could Upvote post on server.'); }
				);
			}
		}

	}
}]);

// Post search controller
myApp.controller('PostSearchController', ['$scope', 'PostsService', function( $scope, PostsService)
{
	$scope.searchForm = '';

	this.Search = function()
	{
		PostsService.LoadSearchPage($scope.searchForm);
		$scope.searchForm = '';
	}
}]);

// Post Display Controller
myApp.controller('PostDisplayController', ['$scope', 'PostsService', function( $scope, PostsService )
{
	$scope.viewingPosts = PostsService.Get();

	var WatchCallback = function()
	{
		$scope.viewingPosts = PostsService.Get();
	}
	PostsService.RegisterObserverCallback(WatchCallback);


	this.Like = function(postIdx)
	{
		PostsService.Like(postIdx);
	}

	this.Dislike = function(postIdx)
	{
		PostsService.Dislike(postIdx);
	}

	this.Follow = function(postIdx)
	{
		alert('Follow post Not implemented!');
	}
}]);

// LogOut Controller
myApp.controller('PostCreateController', ['$scope', 'PostsService', function( $scope, PostsService )
{
	$scope.postForm = { 'content': 'Hahaha!' };

	this.Create = function()
	{
		PostsService.Create($scope.postForm.content);
	}
}]);

// Redirect controller
myApp.controller('RedirectController', ['$scope', 'PostsService', function( $scope, PostsService)
{
	this.ToMyPosts = function()
	{
		alert('Not implemented!');

	}
	this.ToMyGroups = function()
	{
		alert('Not implemented!');
	}
	this.ToMyFeed = function()
	{
		PostsService.LoadFeedPage();
	}
	this.ToMyProfile = function()
	{
		alert('Not implemented!');
	}
}]);
