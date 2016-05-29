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
			unique: true,
			model: 'user',
			columnName: 'escritor',
			type: 'integer',
		},
		content: {
			unique: true,
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
	}
};