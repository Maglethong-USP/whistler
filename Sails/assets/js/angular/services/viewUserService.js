/*
	SCC0219 - Project Whistler

	Group:
		- Rafael Gallo
		- Andreas Munte
		- Guilherme Muzzi


	Service to enable viewing other user's profiles.
*/

// Fetching module reference
var myApp = angular.module('spicyApp');



// Defining User Login/Logout/Register Service
myApp.factory('ViewUserService', ['$http', function($http)
{
	var user = {};

	return {

		'LoadUser' : function(userID)
		{
			// Send request
			$http.post('/user/Get', {
				'id': userID
			}).then(
				// Success
				function(response)
				{
					user = response.data;
					if(typeof user.id === 'undefined')
						alert("User not found.");
				},
				// Error
				function(response)
				{
					alert('Connection error.');
					console.log(response);
				}
			);
		},

		/**
		 * Retrieve currently logged user
		 */
		'Get' : function()
		{
			if(typeof user === 'undefined' || typeof user.id === 'undefined')
				return false;
			else
				return user;
		}
	}
}]);