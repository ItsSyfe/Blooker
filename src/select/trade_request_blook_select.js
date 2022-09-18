const TradeComponents = require('../components/TradeComponents.js');
const BlookHelper = require('../util/BlookHelper.js');
const Logger = require('../util/Logger.js');

module.exports = {
	data: {
		customId: 'trade_request_blook_select',
	},
	async execute(interaction) {
		const blookSelected = interaction.values[0];

		const fullBlookName = blookSelected  === "mystical" ? "Any Mystical Blook" : blookSelected  === "chroma" ? "Any Chroma Blook" : blookSelected  === "legendary" ? "Any Legendary Blook" : blookSelected  === "epic" ? "Any Epic Blook" : blookSelected  === "rare" ? "Any Rare Blook" : blookSelected  === "uncommon" ? "Any Uncommon Blook" : await BlookHelper.getFullBlookName(blookSelected);

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });
		const blookInTrade = trade.request.find(blook => blook.shortname === blookSelected);
		await interaction.client.trades.update({ request: [ ...trade.request.filter(blook => blook.shortname !== blookSelected), { type: 'blook', fullname: fullBlookName, shortname: blookSelected, amount: 1 + (blookInTrade ? blookInTrade.amount : 0) } ] }, { where: { discordinteractionid: interaction.message.interaction.id } });

		Logger.debug(`${this.data.customId} | ${JSON.stringify(trade.request)} --> ${JSON.stringify((await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } })).request)} | (Interaction ${interaction.message.interaction.id})`);
		const tradeRequestBlookEmbedSuccess = TradeComponents.tradeRequestBlookEmbedSuccess;
		tradeRequestBlookEmbedSuccess.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });
		tradeRequestBlookEmbedSuccess.setDescription(`Successfully added **${fullBlookName}** to your request.`);

		await interaction.update({ content: null, embeds: [tradeRequestBlookEmbedSuccess], components: [TradeComponents.tradeMainMenuRow] });
	},
};