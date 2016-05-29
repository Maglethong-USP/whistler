/*
 * Grupo:
 * 	Rafael Gallo
 * 	Andreas Munte
 * 	Guilherme Muzzi
 */

module.exports = {

	GetFeed : function(userid, firstPostIdx, postCount, callback)
	{
		var post = {
		//	'writer': userid,
		};

/*
		SELECT	usuario.id as "writerID", 
				usuario.nome as "writerProfileName", 
				usuario.midia_path as "writerPicturePath", 

				post.id as "id", 
				post.conteudo as "content", 
				post.data as "date", 
				post.rankpos as "likes", 
				post.rankneg as "dislikes",

				rank.tipo as "userRank"

		FROM post 
		JOIN usuario 
			ON post.escritor = usuario.id
		LEFT JOIN rank
			ON rank.post = post.id
			AND rank.avaliador = usuario.id
*/


		Post.query('SELECT usuario.id as "writerID", usuario.nome as "writerProfileName", usuario.midia_path as "writerPicturePath", post.id as "id", post.conteudo as "content", post.data as "date", post.rankpos as "likes", post.rankneg as "dislikes", rank.tipo as "userRank" FROM post JOIN usuario ON post.escritor = usuario.id LEFT JOIN rank ON rank.post = post.id AND rank.avaliador = usuario.id', function(err, result){ // TODO [Where para apenas mostrar posts relevantes para este user]

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
						'id': rows[i].writerID,
						'profileName': rows[i].writerProfileName,
						'picturePath': rows[i].writerPicturePath
					},
					'id': rows[i].id,
					'content': rows[i].content,
					'date': rows[i].date,
					'likes': rows[i].likes,
					'dislikes': rows[i].dislikes,
					'userLikes': rows[i].userRank == 'P',
					'userDislikes': rows[i].userRank == 'N'
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