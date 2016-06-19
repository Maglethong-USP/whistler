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



	this.New = function()
	{
		alert("!");
		GroupService.Create();
	}

	this.ChangeName = function(groupIdx)
	{
		alert("!");
		GroupService.Rename(groupIdx, $scope.groupForm.newGroupName);
		$scope.groupForm.newGroupName = '';
	}

	this.Delete = function(groupIdx)
	{
		alert("!");
		GroupService.Delete(groupIdx);
	}

	this.AddMember = function(groupIdx)
	{
		alert("!");
		GroupService.AddMember(groupIdx, $scope.groupForm.newMemberName);
		$scope.groupForm.newMemberName = '';
	}

	this.RemoveMember = function(groupIdx, userIdx)
	{
		alert("!");
		GroupService.RemoveMember(groupIdx, userIdx);
	}
}]);