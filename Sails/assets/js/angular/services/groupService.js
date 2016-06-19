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
		'Create' : function(groupName)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/group/Create', {'owner': user.id, 'name': groupName}).then(
					// Success
					function(response)
					{	
						response.data.groupMembers = [];
						groupList.push(response.data);
						notifyObservers();
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
		'Rename' : function(groupIdx, newName)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/group/ChangeName', 
				{
					'id': groupList[groupIdx].id,
					'newName': newName
				}).then(
					// Success
					function(response)
					{	
						// TODO [Check if resp ok]
						groupList[groupIdx].name = newName;
						notifyObservers();
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
		'Delete' : function(groupIdx)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/group/Delete', 
				{
					'id': groupList[groupIdx].id
				}).then(
					// Success
					function(response)
					{	
						// TODO [Check if resp ok]
						groupList.splice(groupIdx, 1);
						notifyObservers();
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
		'AddMember' : function(groupIdx, memberName)
		{
			var user = UserService.Get();

			if(user)
			{
				$http.post('/group/AddMember', 
				{
					'id': groupList[groupIdx].id,
					'memberName': memberName
				}).then(
					// Success
					function(response)
					{	
						// TODO [Check if resp ok + Treat Duplicated insert]
						for(var i=0; i<response.data.length; i++)
							groupList[groupIdx].groupMembers.push(response.data[i]);
						notifyObservers();
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
		'RemoveMember' : function(groupIdx, memberIDArray)
		{
			var user = UserService.Get();

			if(user)
			{
				// Run for all all user ids in array
				for(var i=0; i<memberIDArray.length; i++)
				{
					$http.post('/group/RemoveMember', 
					{
						'group': groupList[groupIdx].id,
						'member': memberIDArray[i]
					}).then(
						// Success
						function(response)
						{
							// Removed
							if(typeof response.data.id !== 'undefined')
							{
								// Remove from group members locally as well
								for(var j=0; j<groupList[groupIdx].groupMembers.length; j++)
								{
									if(groupList[groupIdx].groupMembers[j].id == response.data.membro)
									{
										groupList[groupIdx].groupMembers.splice(j, 1);
										break;
									}
								}
								notifyObservers();
							}
							// Removing error
							else
							{
								console.log("???");
							}
						},
						// Error
						function(response)
						{
							alert('Server communication error.');
						}
					);
				}
			}
			else
			{
				console.log('Invalid operation: Log in first.');
			}
		},
		// __________
		'Get' : function()
		{
			return groupList;
		}
	};
}]);