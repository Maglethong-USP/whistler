/*
	SCC0219 - Project Whistler

	Group:
		- Rafael Gallo
		- Andreas Munte
		- Guilherme Muzzi


	Defines User Service for Login, Logout, and Register user functionality.
*/

// Fetching module reference
var myApp = angular.module('spicyApp');



// Defining User Login/Logout/Register Service
myApp.factory('UserService', ['$http', function($http)
{
	var user = {};

	return {
		/**
		 * Log in user with password
		 *
		 * @param {string} login
		 * @param {string} password
		 */
		'Login' : function(login, password)
		{
			// Send request
			$http.post('/user/Authenticate', {
				'login': login, 
				'password': password
			}).then(
				// Success
				function(response)
				{
					user = response.data;
					if(typeof user.id === 'undefined')
						alert("Wrong login or password.");
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
		 * Log out the user
		 */
		'Logout' : function()
		{
			user = {};
		},

		/**
		 * Register a new user
		 *
		 * @param {string} profileName
		 * @param {string} login
		 * @param {string} password
		 */
		'Register' : function(profileName, login, password)
		{
			// Send request
			$http.post('/user/Register', {
				'profileName': profileName, 
				'login': login, 
				'password': password
			}).then(
				// Success
				function(response)
				{
					user = response.data;
					if(typeof user.id === 'undefined')
						alert("User name already in use.");
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
		 * Change users profile information
		 *
		 * @param {string} profileName
		 * @param {date} birthDate
		 * @param {text} description
		 */
		'ChangeProfileInfo' : function(profileName, birthDate, description)
		{
			if(typeof user.id === 'undefined')
				alert("Must be logged in to do that.");
			else
			{
				// Send request
				$http.post('/user/ChangeProfileInfo', {
					'id': user.id,
					'profileName': profileName, 
					'birth': birthDate, 
					'description': description
				}).then(
					// Success
					function(response)
					{
						if(response.data == null || typeof response.data.id === 'undefined')
							alert("Invalid information entered.");
						else
						{
							alert("Success");
							user = response.data;
						}
					},
					// Error
					function(response)
					{
						alert('Connection error.');
						console.log(response);
					}
				);
			}
		},

		/**
		 * Change users password if correct old password provided
		 *
		 * @param {string} oldPassword
		 * @param {string} newPassword
		 */
		'ChangePassword' : function(oldPassword, newPassword)
		{
			if(typeof user.id === 'undefined')
				alert("Must be logged in to do that.");
			else
			{
				// Send request
				$http.post('/user/ChangePassword', {
					'id': user.id,
					'oldPassword': oldPassword,
					'newPassword': newPassword
				}).then(
					// Success
					function(response)
					{
						if(response.data == null || typeof response.data.id === 'undefined')
							alert("Invalid password.");
						else
						{
							alert("Success");
							user = response.data; // Should not be required
						}
					},
					// Error
					function(response)
					{
						alert('Connection error.');
						console.log(response);
					}
				);
			}
		},

		/**
		 * Delete the user's account permanently
		 */
		'DeleteAccount' : function()
		{
			if(typeof user.id === 'undefined')
				alert("Must be logged in to do that.");
			else
			{
				// Send request
				$http.post('/user/DeleteAccount', {
					'id': user.id
				}).then(
					// Success
					function(response)
					{
						alert("Success");
						user = {};
					},
					// Error
					function(response)
					{
						alert('Connection error.');
						console.log(response);
					}
				);
			}
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
	};
}]);