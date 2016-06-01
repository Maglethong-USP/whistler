/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'comentario',
	attributes: {
		id: {
			autoIncrement: true,
			columnName: 'id',
			primaryKey: true,
			type: 'integer'
		},
		post: {
			model: 'post',
			columnName: 'post',
			type: 'integer',
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
		}
	}
};

