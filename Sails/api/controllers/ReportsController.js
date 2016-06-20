/**
 * ReportsController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// User influence report
	GetTop20Users : function(req, res)
	{
		var timeDelta = (req.body) ? req.body : undefined;

		sails.log(timeDelta);

		var query =   "SELECT * FROM relatorio_usuarios_top20(" 
					+ timeDelta.start + ", " 
					+ timeDelta.end + ")"; // TODO [Both dates must be in 'YYYY-MM-DD' format]

		Reports.query(query, function(err, result)
		{
			if(err) sails.log(err);

			return res.json(result);
		});
	},
	// Post influence report
	GetTop20Posts : function(req, res)
	{
		var timeDelta = (req.body) ? req.body : undefined;
		var query =   "SELECT * FROM relatorio_publicacoes_top20(" 
					+ timeDelta.start + ", " 
					+ timeDelta.end + ")"; // TODO [Both dates must be in 'YYYY-MM-DD' format]

		Reports.query(query, function(err, result)
		{
			if(err) sails.log(err);

			return res.json(result);
		});
	}
};

