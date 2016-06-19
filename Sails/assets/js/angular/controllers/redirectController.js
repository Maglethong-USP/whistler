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




// Redirect controller
myApp.controller('RedirectController', ['UserService', 'PostsService', '$location', function(UserService, PostsService, $location)
{
	this.ToMyPosts = function()
	{ 
		if(UserService.Get())
			$location.path('/myprofile');
	}

	this.ToMyGroups = function()
	{ 
		if(UserService.Get())
			$location.path('/mygroups');
	}

	this.ToMyFeed = function()
	{ 
		PostsService.LoadFeedPage();
	}

	this.ToProfileEdit = function()
	{
		if(UserService.Get())
			$location.path('/editprofile');
	}

	this.ToStatistics = function()
	{
		if(UserService.Get())
			$location.path('/statistics');
	}
}]);