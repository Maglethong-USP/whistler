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
		alert('Not implemented!');
	}

	this.ToMyGroups = function()
	{ 
		alert('Not implemented!');

		if(UserService.Get())
			$location.path('/mygroups');
	}

	this.ToMyFeed = function()
	{ 
		PostsService.LoadFeedPage();
	}

	this.ToMyProfile = function()
	{ 
		alert('Not implemented!');

		if(UserService.Get())
			$location.path('/myprofile');
	}
}]);