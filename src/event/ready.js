const Logger = require('../util/Logger.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.account.sync();
		client.trades.sync();
		Logger.debug('Initialized');
		Logger.info(`Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'Blooket Companion Bot', type: 'PLAYING' }] });
	},
};