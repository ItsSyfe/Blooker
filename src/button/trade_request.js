const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_request',
	},
	async execute(interaction) {
		const tradeRequestEmbed = TradeComponents.tradeRequestEmbed;
		tradeRequestEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		await interaction.update({ content: null, embeds: [tradeRequestEmbed], components: [TradeComponents.tradeRequestRow] });
	},
};