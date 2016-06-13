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
			if(err) return res.serverError(err);

			var rows = result.rows;
			var ret = [];
			for(var i=firstPostIdx; i<rows.length && i-firstPostIdx <postCount; i++)
			{
				ret.push({
					'id': rows[i].id,
					'writer': {
						'id': rows[i].writerid,
						'profileName': rows[i].writerprofilename,
						'picturePath': rows[i].writerpicturepath ? rows[i].writerpicturepath : 'Uploads/profile-picture.jpg'
					},
					'content': rows[i].content,
					'date': rows[i].date,
					'likes': rows[i].likes,
					'dislikes': rows[i].dislikes,
					'commentCount': rows[i].comments,
					'userLikes': rows[i].userrank == 'P',
					'userDislikes': rows[i].userrank == 'N'
				});
			}
			callback(ret);
		});
	},

	GetUserPosts : function(userid, targetid, firstPostIdx, postCount, callback)
	{
		Post.query('SELECT * FROM userPosts(' + userid +', ' + targetid +')', function(err, result)
		{
			if(err) return res.serverError(err);

			var rows = result.rows;
			var ret = [];
			for(var i=firstPostIdx; i<rows.length && i-firstPostIdx <postCount; i++)
			{
				ret.push({
					'id': rows[i].id,
					'writer': {
						'id': rows[i].writerid,
						'profileName': rows[i].writerprofilename,
						'picturePath': rows[i].writerpicturepath ? rows[i].writerpicturepath : 'Uploads/profile-picture.jpg'
					},
					'content': rows[i].content,
					'date': rows[i].date,
					'likes': rows[i].likes,
					'dislikes': rows[i].dislikes,
					'commentCount': rows[i].comments,
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
					'commentCount': rows[i].comments,
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
	},

	Share : function(userid, postid, callback) // TODO [transformar em tabela share no lugar de copiar o post]
	{
		var post = {
			'id': postid
		};

		Post.findOne(post).exec(function(err, result){
			if(err){ sails.log(err); }

			var newpost = {
				'writer': userid,
				'content': result.content
			}

			Post.create(newpost).exec(function(err1, result1){
				if(err){ sails.log(err1); }

				callback(result1);
			});
		});
	}
}