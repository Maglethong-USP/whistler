



var myApp = angular.module('spicyApp');



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
}]);