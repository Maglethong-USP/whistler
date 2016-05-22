/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// /task/Load
	Authenticate : function(req, res)
	{
		var user = (req.body) ? req.body : undefined;

		UserService.Authenticate(user.login, user.password, function(result)
		{
			return res.json(result);
		});
	},

	// /task/Save
	Register : function(req, res)
	{
		var user = (req.body) ? req.body : undefined;

		sails.log(user);
		UserService.Register(user.profileName, user.login, user.password, function(result)
		{
			return res.json(result);
		});
	}
};

