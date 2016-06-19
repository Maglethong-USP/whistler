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
		.populate('owner')
		.populate('groupMembers')
		// Ideally we want to populate again with 'groupMembers[].member' but waterline won't do that
		//   so we will request all the users after getting this structure on the client
		//   TODO [Improve the above]
		.exec(function(err, result)
		{
			if(err) sails.log(err);

			console.log(result);
			callback(result);
		});
	},
	
	Create : function(ownerID, groupName, callback)
	{
		var group = {
			'owner': ownerID,
			'name': groupName
		};

		Group.create(group).exec(function(err, result)
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
		var groupMember = {
			'groupId': ownerID,
			'member': memberID
		};

		User.find({'profileName': memberName}).exec(function(err, foundArr)
		{
			var ret = [];

			for(var i=0; i<foundArr.length; i++)
			{
				GroupMember.create({'groupId': ownerID, 'member': foundArr[i].id}).exec(function(err, result)
				{
					if(err) sails.log(err);

					ret.push(result);
				});
			}

			callback(ret);
		});
	},
	
	RemoveMember : function(groupID, memberID, callback)
	{
		var groupMember = {
			'groupId': ownerID,
			'member': memberID
		};

		GroupMember.destroy(groupMember).exec(function(err, result)
		{
			if(err) sails.log(err);

			callback(result);
		});
	}
}