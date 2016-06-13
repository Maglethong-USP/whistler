/**
 * Follow.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'postgres',
	tableName: 'seguir',
	attributes: {
		follower: {
			model: 'user',
			columnName: 'seguidor',
			type: 'integer',
		},
		followee: {
			model: 'user',
			columnName: 'seguido',
			type: 'integer',
		}
	}
};