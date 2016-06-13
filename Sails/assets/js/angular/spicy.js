
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
	}).when('/search', {
		templateUrl: 'templates/feed.html',
		controller: 'UserController'
	}).when('/mygroups', {
		templateUrl: 'templates/myGroups.html',
		controller: 'UserController'
	}).when('/myprofile', {
		templateUrl: 'templates/myProfile.html',
		controller: 'UserController'
	}).when('/otherprofile', {
		templateUrl: 'templates/otherProfile.html',
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
//							console.log(viewingPosts[i].commentCount + '(' + i + ' )');
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
		// Load user specific posts
		'LoadUserPosts' : function(userId)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/post/GetUserPosts', 
				{
					'userid': user.id,
					'target': userId
				}).then(
					// Success
					function(response)
					{	
						viewingPosts = response.data;
						notifyObservers();
					//	$location.path('/feed'); // TODO [change location]
						$location.path('/otherprofile').search({id: userid});

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
						alert('Could not load user profile.');
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
						$location.path('/search').search({search: searchString});

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
			var user = UserService.Get();

			if(user)
			{
				$http.post('/post/Share', {
					'userid': user.id,
					'postid': viewingPosts[postIdx].id
				}).then(
					// Success
					function(response){ }, // TODO [something to do here?]
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
		},
		// Comment
		'Comment' : function(postIdx, comment)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/Comment/NewComment', {
					'writerid': user.id,
					'postid': viewingPosts[postIdx].id,
					'content': comment
				}).then(
					// Success
					function(response)
					{
						response.data.writer = user;
						viewingPosts[postIdx].comments.push(response.data);
					},
					// Error
					function(response)
					{
						alert('Could not Create comment on server.');
					}
				);
			}
			else
			{
				console.log('Invalid operation: can not create comment if not logged in.');
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
myApp.controller('PostDisplayController', ['$scope', 'PostsService', 'RedirectService', function( $scope, PostsService, RedirectService )
{
	$scope.viewingPosts = PostsService.Get();

	var WatchCallback = function()
	{
		$scope.viewingPosts = PostsService.Get();
	}
	PostsService.RegisterObserverCallback(WatchCallback);



	this.RedirectToWriterProfile = function(postIdx)
	{
		PostsService.LoadUserPosts($scope.viewingPosts[postIdx].writer.id);
	}

	this.Like = function(postIdx)
	{
		PostsService.Like(postIdx);
	}

	this.Dislike = function(postIdx)
	{
		PostsService.Dislike(postIdx);
	}

	this.Share = function(postIdx)
	{
		PostsService.Share(postIdx);
	}
}]);

// LogOut Controller
myApp.controller('PostCreateController', ['$scope', 'PostsService', function( $scope, PostsService )
{
	$scope.postForm = { 'content': 'Hahaha!' }; // TODO [escrever novo post na view]

	this.Create = function()
	{
		PostsService.Create($scope.postForm.content);
	}
}]);

// Comment create controller
myApp.controller('CreateCommentController', ['$scope', 'PostsService', function($scope, PostsService){
	$scope.commentInput = '';

	this.Create = function(postIdx)
	{
		PostsService.Comment(postIdx, $scope.commentInput);
		$scope.commentInput = '';
	}
}])


	//////////////
	// Redirect //
	//////////////

// Redirect Service
myApp.factory('RedirectService', ['UserService', 'PostsService', '$location', function(UserService, PostsService, $location)
{
	return {
		// Redirect to logged user posts page
		'ToMyPosts' : function()
		{
			alert('Not implemented!');
		},
		// Redirect to logged user groups page
		'ToMyGroups' : function()
		{
			alert('Not implemented!');

			if(UserService.Get())
				$location.path('/mygroups');
		},
		// Redirect to logged user feed page
		'ToMyFeed' : function()
		{
			PostsService.LoadFeedPage();
		},
		// Redirect to logged user profile page
		'ToMyProfile' : function()
		{

			alert('Not implemented!');

			if(UserService.Get())
				$location.path('/myprofile');
		}
	};
}]);

// Redirect controller
myApp.controller('RedirectController', ['RedirectService', function(RedirectService)
{
	this.ToMyPosts = function(){ RedirectService.ToMyPosts(); }
	this.ToMyGroups = function(){ RedirectService.ToMyGroups(); }
	this.ToMyFeed = function(){ RedirectService.ToMyFeed(); }
	this.ToMyProfile = function(){ RedirectService.ToMyProfile(); }
}]);



	////////////
	// GROUPS //
	////////////


myApp.controller('GroupController', ['$scope', function($scope)
{
	$scope.groupList = [];



	this.NewGroup = function()
	{

	}

	this.SaveGroup = function(groupIdx)
	{

	}

	this.DeleteGroup = function(groupIdx)
	{

	}

	this.AddMember = function(groupIdx, memberName)
	{

	}

	this.RemoveMember = function(groupIdx, memberIdx)
	{

	}
}]);
