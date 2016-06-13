/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'post',
	attributes: {
		id: {
			autoIncrement: true,
			columnName: 'id',
			primaryKey: true,
			type: 'integer'
		},
		writer: {
			model: 'user',
			columnName: 'escritor',
			type: 'integer',
		},
		content: {
			columnName: 'conteudo',
			type: 'text'
		},
		date: {
			columnName: 'data',
			type: 'datetime'
		},
		likes: {
			columnName: 'rankpos',
			type: 'integer'
		},
		dislikes: {
			columnName: 'rankneg',
			type: 'integer'
		},
		shares: {
			columnName: 'compartilhamentos',
			type: 'integer'
		},
		comments: {
			collection: 'comment',
			via: 'post'
		}
	}
};