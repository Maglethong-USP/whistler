/*
 * Grupo:
 * 	Rafael Gallo
 * 	Andreas Munte
 * 	Guilherme Muzzi
 */

module.exports = {
	Authenticate : function(login, password, callback)
	{
		User.find().exec(function(err, users)
		{
			if(err)
				throw err;

			callback(users);
			sails.log(users);
		});
	},

	Register : function(profileName, login, password, callback)
	{
		var user = {
			'id' : 0,
			'login': login,
			'senha': password,
			'nome': profileName
		};

		User.create(user).exec(function(err, result)
		{
			if(err)
				throw err;

			callback(result);
			sails.log(result);
		});
	}
}