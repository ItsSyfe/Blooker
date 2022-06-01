const { info, debug } = require('../util/Logger.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		debug('Initialized');
		info(`Logged in as ${client.user.tag}`);
	},
};