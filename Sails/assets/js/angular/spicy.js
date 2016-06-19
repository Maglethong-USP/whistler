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
	}).when('/editprofile', {
		templateUrl: 'templates/editProfile.html',
		controller: 'UserController'
	}).when('/statistics', {
		templateUrl: 'templates/statistics.html',
		controller: 'UserController'
	}).when('/otherprofile', {
		templateUrl: 'templates/otherProfile.html',
		controller: 'UserController'
	});
});






