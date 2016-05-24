/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'usuario',
	attributes: {
		id: {
			columnName: 'id',
			primaryKey: true,
			type: 'integer'
		},
		login: {
			columnName: 'login',
			unique: true,
			type: 'string'
		},
		password: {
			columnName: 'senha',
			type: 'string'
		},
		profileName: {
			columnName: 'nome',
			type: 'string'
		},
		picturePath: {
			columnName: 'midia_path',
			type: 'string'
		},
		descricao: {
			columnName: 'descricao',
			type: 'text'
		},
		nascimento: {
			columnName: 'nascimento',
			type: 'string'
		}
	}
};

