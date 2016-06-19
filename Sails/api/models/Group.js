/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'grupo',
	attributes: {
		id: {
			autoIncrement: true,
			columnName: 'id',
			primaryKey: true,
			type: 'integer'
		},
		owner: {
			model: 'user',
			columnName: 'dono',
			type: 'integer'
		},
		name: {
			columnName: 'nome',
			type: 'text'
		},
		groupMembers: {
			collection: 'groupMember',
			via: 'group'
		}
	}
};

