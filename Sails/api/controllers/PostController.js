/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// Get news feed for a user
	GetFeed : function(req, res)
	{
		var userid = (req.body) ? req.body.userid : undefined;

		PostService.GetFeed(userid, 0, 99999, function(result)
		{
			return res.json(result);
		});
	},

	// get Posts from specific user
	GetUserPosts : function(req, res)
	{
		var info = (req.body) ? req.body : undefined;

		PostService.GetUserPosts(info.userid, info.target, 0, 99999, function(result)
		{
			return res.json(result);
		});
	},

	// Search posts
	Search : function(req, res)
	{
		var info = (req.body) ? req.body : undefined;

		PostService.Search(info.userid, info.searchString, 0, 99999, function(result)
		{
			return res.json(result);
		});
	},

	// Create a new post for a user
	Create : function(req, res)
	{
		var post = (req.body) ? req.body : undefined;

		PostService.Create(post.writer, post.content, function(result)
		{
			return res.json(result);
		});
	},

	// Share a post
	Share : function(req, res)
	{
		var info = (req.body) ? req.body : undefined;

		PostService.Share(info.userid, info.postid, function(result)
		{
			return res.json(result);
		});
	},

	// 
	GetWriter : function(post, callback)
	{
		User.findOne(post.writer).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}
			post.writer = result;

			callback(post);
		});
	}
};

