/*
 * Grupo:
 * 	Rafael Gallo
 * 	Andreas Munte
 * 	Guilherme Muzzi
 */

module.exports = {

	LoadUserGroups : function(ownerID, callback)
	{
		Group
		.find( {'owner': ownerID} )
		.populate('groupMembers')
		// Ideally we want to populate again with 'groupMembers[].member' but waterline won't do that
		//   so we will request all the users after getting this structure on the client
		//   TODO [Improve the above]
		.exec(function(err, result)
		{
			if(err) sails.log(err);

			callback(result);
		});
	},
	
	Create : function(ownerID, groupName, callback)
	{
		var group = {
			'owner': ownerID,
			'name': groupName
		};

		Group
		.create(group)
		.populate('groupMembers')
		.exec(function(err, result)
		{
			if(err) sails.log(err);

			callback(result);
		});
	},
	
	ChangeName : function(groupID, newName, callback)
	{
		Group.update({ 'id': groupID }, { 'name': newName }).exec(function(err, result)
		{
			if(err) sails.log(err);

			callback(result);
		});
	},
	
	Delete : function(groupID, callback)
	{
		var group = {
			'id': groupID
		};

		Group.destroy(group).exec(function(err, result)
		{
			if(err) sails.log(err);

			callback(result);
		});
	},
	
	AddMember : function(groupID, memberName, callback)
	{
		User
		.find({'profileName': memberName})
		.exec(function(err, foundArr)
		{
			if(err) sails.log(err);

			for(var i=0; i<foundArr.length; i++)
			{
				GroupMember
				.create({'group': groupID, 'member': foundArr[i].id})
				.exec(function(err, result)
				{
					if(err) sails.log(err);
				});
			}

			callback(foundArr);
		});
	},
	
	RemoveMember : function(groupID, memberID, callback)
	{
		var groupMember = {
			'group': groupID,
			'member': memberID
		};

		GroupMember.destroy(groupMember).exec(function(err, result)
		{
			if(err) sails.log(err);

			if(result.length == 1)
				callback(result[0]);
			else
				callback(null);
		});
	}
}