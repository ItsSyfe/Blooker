const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_add',
	},
	async execute(interaction) {
		const tradeAddEmbed = TradeComponents.tradeAddEmbed;
		tradeAddEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		await interaction.update({ content: null, embeds: [tradeAddEmbed], components: [TradeComponents.tradeAddRow] });
	},
};