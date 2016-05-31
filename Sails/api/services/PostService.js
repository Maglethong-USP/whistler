/*
 * Grupo:
 * 	Rafael Gallo
 * 	Andreas Munte
 * 	Guilherme Muzzi
 */

module.exports = {

	GetFeed : function(userid, firstPostIdx, postCount, callback)
	{
		Post.query('SELECT * FROM feed(' + userid + ')', function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			var rows = result.rows;
			var ret = [];
			for(var i=firstPostIdx; i<rows.length && i-firstPostIdx <postCount; i++)
			{
				ret.push({
					'writer': {
						'id': rows[i].writerid,
						'profileName': rows[i].writerprofilename,
						'picturePath': rows[i].writerpicturepath ? rows[i].writerpicturepath : 'Uploads/profile-picture.jpg'
					},
					'id': rows[i].id,
					'content': rows[i].content,
					'date': rows[i].date,
					'likes': rows[i].likes,
					'dislikes': rows[i].dislikes,
					'userLikes': rows[i].userrank == 'P',
					'userDislikes': rows[i].userrank == 'N'
				});
			}

			callback(ret);
		});
	},

	Search : function(userid, searchString, firstPostIdx, postCount, callback)
	{
		Post.query('SELECT * FROM search(' + userid + ', \'' + searchString + '\')', function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			var rows = result.rows;
			var ret = [];
			for(var i=firstPostIdx; i<rows.length && i-firstPostIdx <postCount; i++)
			{
				ret.push({
					'writer': {
						'id': rows[i].writerid,
						'profileName': rows[i].writerprofilename,
						'picturePath': rows[i].writerpicturepath ? rows[i].writerpicturepath : 'Uploads/profile-picture.jpg'
					},
					'id': rows[i].id,
					'content': rows[i].content,
					'date': rows[i].date,
					'likes': rows[i].likes,
					'dislikes': rows[i].dislikes,
					'userLikes': rows[i].userrank == 'P',
					'userDislikes': rows[i].userrank == 'N'
				});
			}

			callback(ret);
		});
	},

	Create : function(writer, content, callback)
	{
		var post = {
			'writer': writer,
			'content': content
		};

		Post.create(post).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			callback(result);
		});
	}
}