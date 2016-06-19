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



myApp.controller('GroupDisplayController', ['$scope', 'GroupService', function($scope, GroupService)
{
	$scope.groupList = GroupService.Get();

	var WatchCallback = function()
	{
		$scope.groupList = GroupService.Get();
	}
	GroupService.RegisterObserverCallback(WatchCallback);
}]);


myApp.controller('GroupEditController', ['$scope', 'GroupService', function($scope, GroupService)
{
	$scope.groupForm = {};


	this.ChangeName = function(groupIdx)
	{
		GroupService.Rename(groupIdx, $scope.groupForm.newGroupName);
		$scope.groupForm.newGroupName = '';
	}

	this.Delete = function(groupIdx)
	{
		GroupService.Delete(groupIdx);
	}

	this.AddMember = function(groupIdx)
	{
		GroupService.AddMember(groupIdx, $scope.groupForm.newMemberName);
		$scope.groupForm.newMemberName = '';
	}

	this.RemoveMember = function(groupIdx)
	{
		GroupService.RemoveMember(groupIdx, $scope.groupForm.choices);
	}
}]);

myApp.controller('NewGroupController', ['$scope', 'GroupService', function($scope, GroupService)
{
	this.NewGroup = function()
	{
		GroupService.Create("New Group");
	}
}]);