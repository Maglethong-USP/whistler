/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// Authenticate user
	Authenticate : function(req, res)
	{
		var user = (req.body) ? req.body : undefined;

		UserService.Authenticate(user.login, user.password, function(result)
		{
			return res.json(result);
		});
	},

	// Register new User
	Register : function(req, res)
	{
		var user = (req.body) ? req.body : undefined;

		UserService.Register(user.profileName, user.login, user.password, function(result)
		{
			return res.json(result);
		});
	},

	// Get a specific user
	Get : function(req, res)
	{
		var userId = (req.body) ? req.body.userId : undefined;

		UserService.Get(userId, function(result)
		{
			return res.json(result);
		});
	},

	// Follow
	Follow : function(req, res)
	{

	},

	// Unfollow
	Unfollow : function(req, res)
	{

	},

	// Change Profile Info
	ChangeProfileInfo : function(req, res)
	{
		var userInfo = (req.body) ? req.body : undefined;

		UserService.ChangeProfileInfo(userInfo.id, userInfo.profileName, 
										userInfo.birth, userInfo.description, 
										function(result)
		{
			return res.json(result);
		});
	},

	// Change Profile Info
	ChangePassword : function(req, res)
	{
		var userInfo = (req.body) ? req.body : undefined;

		UserService.ChangePassword(userInfo.id, userInfo.oldPassword, 
									userInfo.newPassword, function(result)
		{
			return res.json(result);
		});
	},

	// Change Profile Info
	DeleteAccount : function(req, res)
	{
		var userID = (req.body) ? req.body.id : undefined;

		UserService.Delete(userID, function(result){
			return res.json(result);
		});
	}
};

