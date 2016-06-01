/**
 * RankController
 *
 * @description :: Server-side logic for managing ranks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// Upvote a post
	Upvote : function(req, res)
	{
		var rank = (req.body) ? req.body : undefined;
		rank.type = 'P';

		Rank.create(rank).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},
	// Downvote a post
	Downvote : function(req, res)
	{
		var rank = (req.body) ? req.body : undefined;
		rank.type = 'N';

		Rank.create(rank).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},
	// UnUpvote a post
	UnUpvote : function(req, res)
	{
		var rank = (req.body) ? req.body : undefined;

		Rank.destroy(rank).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	},
	// UnDownvote a post
	UnDownvote : function(req, res)
	{
		var rank = (req.body) ? req.body : undefined;

		Rank.destroy(rank).exec(function(err, result)
		{
			if(err)
			{
				sails.log(err);
			}

			return res.json(result);
		});
	}
};
