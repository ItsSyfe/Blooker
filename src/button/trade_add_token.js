const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_add_token',
	},
	async execute(interaction) {
		await interaction.showModal(TradeComponents.tradeAddTokenModal);
	},
};