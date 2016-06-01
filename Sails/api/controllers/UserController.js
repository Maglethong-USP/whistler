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

//		sails.log(user);
		UserService.Register(user.profileName, user.login, user.password, function(result)
		{
			return res.json(result);
		});
	},

	// Get a specific user
	Get : function(req, res)
	{
		var userID = (req.body) ? req.body.userID : undefined;

		User.findone(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	}
};

