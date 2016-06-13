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
			}

			if(result.length == 1)
			{
				UserService.CheckPictureExists(result[0].picturePath, function(path){
					result[0].picturePath = path;
					callback(result[0]);
				});
			}
			else
				callback({});
		});
	},

	Register : function(profileName, login, password, callback)
	{
		var user = {
			'login': login,
			'password': password,
			'profileName': profileName
		};

		User.create(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			callback(result);
		});
	},

	Delete : function(userId, callback) // TODO [Test]
	{
		var user = {
			'id': userId
		};

		User.destroy(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},

	Get : function(userId, callback) // TODO [Test]
	{
		var user = {
			'id': userId
		};

		User.findone(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			callback(result);
		});
	},

	// Follow
	Follow : function(follower, followee, callback) // TODO [Test]
	{
		var followEntry = {
			'follower': follower,
			'followee': followee
		};

		Follow.create(followEntry).exec(function(err, result){
			if(err)
			{
				sails.log(err);
			}

			callback(result);
		});
	},

	// Unfollow
	Unfollow : function(follower, followee, callback) // TODO [Test]
	{
		var user = {
			'id': userId
		};

		User.destroy(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},

	CheckPictureExists : function(path, callback)
	{
		if( !path )
		{
			callback('Uploads/profile-picture.jpg');
		}
		else
		{
			fs = require('fs');

			fs.exists(path, function(exists)
			{
				if(!exists)
					callback('Uploads/profile-picture.jpg');
				else
					callback(path);
			});
		}
	}
}