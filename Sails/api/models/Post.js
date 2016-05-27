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
		writer: {
			primaryKey: true,
			model: 'user',
			columnName: 'escritor',
			type: 'integer',
		},
		content: {
			columnName: 'conteudo',
			primaryKey: true,
			type: 'text'
		},
		date: {
			columnName: 'data',
			type: 'date'
		},
		likes: {
			columnName: 'rankpos',
			type: 'integer'
		},
		dislikes: {
			columnName: 'rankneg',
			type: 'integer'
		},
	}
};