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
myApp.controller('RedirectController', ['UserService', 'PostsService', 'GroupService', '$location', function(UserService, PostsService, GroupService, $location)
{
	this.ToMyPosts = function()
	{ 
		if(UserService.Get())
			$location.path('/myprofile');
	}

	this.ToMyGroups = function()
	{
		GroupService.LoadGroupsPage();
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