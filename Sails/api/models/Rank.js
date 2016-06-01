/**
 * Rank.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'rank',
	attributes: {
		post: {
			primaryKey: true,
			model: 'post',
			columnName: 'post',
			type: 'integer',
		},
		ranker: {
			primaryKey: true,
			model: 'user',
			columnName: 'avaliador',
			type: 'integer'
		},
		type: {
			columnName: 'tipo',
			type: 'string',
			enum: ['P', 'N'],
		}
	}
};