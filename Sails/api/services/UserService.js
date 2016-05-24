/*
 * Grupo:
 * 	Rafael Gallo
 * 	Andreas Munte
 * 	Guilherme Muzzi
 */

module.exports = {
	Authenticate : function(login, password, callback)
	{
		var user = {
			'login': login,
			'password': password
		};

		User.find(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
				throw err;
			}

			if(result.length == 1)
				callback(result[0]);
			else
				callback({});
		});
	},

	Register : function(profileName, login, password, callback)
	{
		var user = {
			'id' : 0,
			'login': login,
			'password': password,
			'profileName': profileName
		};

		User.create(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
				throw err;
			}

			callback(result);
		});
	}
}