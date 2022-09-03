const TradeComponents = require('../components/TradeComponents.js');
const BlookHelper = require('../util/BlookHelper.js');

module.exports = {
	data: {
		customId: 'trade_add_blook_select',
	},
	async execute(interaction) {
		const blookSelected = interaction.values[0];

		const fullBlookName = await BlookHelper.getFullBlookName(blookSelected);

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });
		await interaction.client.trades.update({ offer: [ ...trade.offer, { type: 'blook', fullname: fullBlookName, shortname: blookSelected, amount: 1 } ] }, { where: { discordinteractionid: interaction.message.interaction.id } });

		const tradeAddBlookEmbedSuccess = TradeComponents.tradeAddBlookEmbedSuccess;
		tradeAddBlookEmbedSuccess.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });
		tradeAddBlookEmbedSuccess.setDescription(`Successfully added **${fullBlookName}** to your offer.`);

		await interaction.update({ content: null, embeds: [tradeAddBlookEmbedSuccess], components: [TradeComponents.tradeMainMenuRow] });
	},
};