const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_add_blook',
	},
	async execute(interaction) {
		const tradeAddBlookEmbed = TradeComponents.tradeAddBlookEmbed;
		tradeAddBlookEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		await interaction.update({ content: null, embeds: [tradeAddBlookEmbed], components: [TradeComponents.tradeMainMenuRow, TradeComponents.tradeAddBlookRow, TradeComponents.tradeAddBlookRowExtra] });
	},
};