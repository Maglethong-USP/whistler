/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	LoadUserGroups : function(req, res)
	{
		var userID = (req.body) ? req.body.userid : undefined;

		GroupService.LoadUserGroups(userID, function(result)
		{
			return res.json(result);
		});
	},
	
	Create : function(req, res)
	{
		var groupInfo = (req.body) ? req.body : undefined;

		GroupService.Create(groupInfo.owner, groupInfo.name, function(result)
		{
			return res.json(result);
		});
	},
	
	ChangeName : function(req, res)
	{
		var groupInfo = (req.body) ? req.body : undefined;

		GroupService.ChangeName(groupInfo.id, groupInfo.newName, function(result)
		{
			return res.json(result);
		});
	},
	
	Delete : function(req, res)
	{
		var groupID = (req.body) ? req.body.id : undefined;

		GroupService.ChangeName(groupID, function(result)
		{
			return res.json(result);
		});
	},
	
	AddMember : function(req, res)
	{
		var groupInfo = (req.body) ? req.body : undefined;

		GroupService.AddMember(groupInfo.owner, groupInfo.memberName, function(result)
		{
			return res.json(result);
		});
	},
	
	RemoveMember : function(req, res)
	{
		var groupInfo = (req.body) ? req.body : undefined;

		GroupService.RemoveMember(groupInfo.owner, groupInfo.member, function(result)
		{
			return res.json(result);
		});
	}
};

