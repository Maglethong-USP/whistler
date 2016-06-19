/**
 * GroupMember.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'membrogrupo',
	attributes: {
		id: {
			autoIncrement: true,
			columnName: 'id',
			primaryKey: true,
			type: 'integer'
		},
		group: {
			model: 'group',
			columnName: 'grupo',
			type: 'integer'
		},
		member: {
			model: 'user',
			columnName: 'membro',
			type: 'integer'
		}
	}
};

