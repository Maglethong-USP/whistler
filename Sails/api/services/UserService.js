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

		User.findOne(user).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
				callback(result);
			}
			else
			{
				UserService.CheckPictureExists(result.picturePath, function(path){
					result.picturePath = path;
					callback(result);
				});
			}
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
				callback(result);
			}
			else
			{
				UserService.CheckPictureExists(result.picturePath, function(path){
					result.picturePath = path;
					callback(result);
				});
			}
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

			return callback(result);
		});
	},

	Get : function(userId, callback) // TODO [Test]
	{
		User.findOne( {'id': userId} ).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
				callback(result);
			}
			else
			{
				UserService.CheckPictureExists(result.picturePath, function(path){
					result.picturePath = path;
					callback(result);
				});
			}
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

			callback(result);
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
	},

	ChangeProfileInfo : function(userId, profileName, birth, description, callback)
	{
		var newUserInfo = {};
		var doIt = false;
		if(typeof profileName !== 'undefined') {newUserInfo.profileName = profileName; doIt=true;}
		if(birth != null && typeof birth !== 'undefined') {newUserInfo.birth = birth; doIt=true;}
		if(typeof description !== 'undefined') {newUserInfo.description = description; doIt=true;}

		if(doIt)
		{
			User.update({'id': userId}, newUserInfo, function(err, updated){
				if(err) sails.log(err);
				console.log(updated);
				callback(updated[0]);
			});
		}
		else
		{
			callback(null);
		}
	},

	ChangePassword : function(userId, oldPassword, newPassword, callback)
	{
		User.update({'id': userId, 'password': oldPassword}, {'password': newPassword}, function(err, updated){
			
			if(err)
			{
				sails.log(err);
				callback(result);
			}
			else
			{
				if(updated.length == 1)
				{
					UserService.CheckPictureExists(updated[0].picturePath, function(path){
													updated[0].picturePath = path;
													callback(updated[0]);
					});
				}
				else
					callback(null);
			}			
		});
	}
}