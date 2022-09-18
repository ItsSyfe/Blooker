const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_request_token',
	},
	async execute(interaction) {
		await interaction.showModal(TradeComponents.tradeRequestTokenModal);
	},
};