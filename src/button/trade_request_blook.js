const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_request_blook',
	},
	async execute(interaction) {
		const tradeRequestBlookEmbed = TradeComponents.tradeRequestBlookEmbed;
		tradeRequestBlookEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		await interaction.update({ content: null, embeds: [tradeRequestBlookEmbed], components: [TradeComponents.tradeMainMenuRow, TradeComponents.tradeRequestBlookRow, TradeComponents.tradeRequestBlookRowExtra] });
	},
};