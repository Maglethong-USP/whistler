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
						// TODO [check for SGQ exception]
						var newPost = response.data;
						newPost.writer = user;
						viewingPosts.unshift(newPost);
						notifyObservers();
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