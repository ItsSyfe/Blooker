const TradeComponents = require('../components/TradeComponents.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		customId: 'trade_add_token_modal',
	},
	async execute(interaction) {
		const tokenAmount = await parseInt(interaction.fields.getTextInputValue('trade_add_token_input')) || 0;

		if (isNaN(tokenAmount) || tokenAmount < 1) {
			const tradeAddTokenModalEmbedFailed = TradeComponents.tradeAddTokenModalEmbedFailed;
			tradeAddTokenModalEmbedFailed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

			return await interaction.update({ content: null, embeds: [tradeAddTokenModalEmbedFailed], components: [TradeComponents.tradeMainMenuRow] });
		}

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });
		await interaction.client.trades.update({ offer: [ ...trade.offer.filter(item => item.type != 'token'), { type: 'token', amount: tokenAmount } ] }, { where: { discordinteractionid: interaction.message.interaction.id } });

		const tradeAddTokenModalEmbedSuccess = new EmbedBuilder()
			.setTitle('Trade Offer Creation Menu')
			.setColor('#990000')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription(`Successfully set tokens in offer to **${tokenAmount}** tokens.`);

		await interaction.update({ content: null, embeds: [tradeAddTokenModalEmbedSuccess], components: [TradeComponents.tradeMainMenuRow] });
	},
};