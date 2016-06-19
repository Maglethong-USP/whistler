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
myApp.factory('GroupService', ['UserService', '$http', '$location', function(UserService, $http, $location)
{
	var groupList = [];
	var observerCallbacks = []; // $watch wasn't working properly

	// Notification call
	var notifyObservers = function()
	{
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

	var LoadUsers = function(groupIdx, memberIdx)
	{
		$http.post('/user/Get', {
			'userId': groupList[groupIdx].groupMembers[memberIdx].member
		}).then(
			// Success
			function(response)
			{
				groupList[groupIdx].groupMembers[memberIdx] = response.data;
				notifyObservers();
			},
			// Error
			function(response)
			{
				alert('Server communication error.');
			}
		);
	}

	return {
		// Register observer
		'RegisterObserverCallback' : function(callback)
		{
			observerCallbacks.push(callback);
		},
		// __________
		'LoadGroupsPage' : function()
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/group/LoadUserGroups', {'userid': user.id}).then(
					// Success
					function(response)
					{	
						groupList = response.data;
						$location.path('/mygroups');
						notifyObservers();

						for(var i=0; i<groupList.length; i++)
							for(var j=0; j<groupList[i].groupMembers.length; j++)
								LoadUsers(i, j);
					},
					// Error
					function(response)
					{
						alert('Server communication error.');
					}
				);
			}
			else
			{
				console.log('Invalid operation: Log in first.');
			}
		},

		// __________
		'Create' : function()
		{
		},
		// __________
		'Rename' : function(groupIdx, newName)
		{
		},
		// __________
		'Delete' : function(groupIdx)
		{
		},
		// __________
		'AddMember' : function(groupIdx, memberName)
		{
		},
		// __________
		'RemoveMember' : function(groupIdx, memberIdx)
		{
		},
		// __________
		'Get' : function()
		{
			return groupList;
		}
	};
}]);