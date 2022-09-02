const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_menu',
	},
	async execute(interaction) {
		const tradeMenuEmbed = TradeComponents.tradeMenuEmbed;
		tradeMenuEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		await interaction.update({ content: null, embeds: [tradeMenuEmbed], components: [TradeComponents.tradeMenuRow] });
	},
};