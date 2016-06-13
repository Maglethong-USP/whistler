/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	// Get news feed for a user
	GetComment : function(req, res)
	{
		var postid = (req.body) ? req.body.postid : undefined;

		Comment.find({'post': postid})
		.populate('writer')
		.exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},

	// New comment
	NewComment : function(req, res)
	{
		var info = (req.body) ? req.body : undefined;

		var comment = {
			'post': info.postid,
			'writer': info.writerid,
			'content': info.content
		};

		Comment.create(comment)
		//.populate('writer') // Does not work... population on client with logged user
		.exec(function(err, result)
		{
			if(err){ sails.log(err); }

			return res.json(result);
		});
	}
};

