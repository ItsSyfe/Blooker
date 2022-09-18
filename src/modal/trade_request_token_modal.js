const TradeComponents = require('../components/TradeComponents.js');
const { EmbedBuilder } = require('discord.js');
const Logger = require('../util/Logger.js');

module.exports = {
	data: {
		customId: 'trade_request_token_modal',
	},
	async execute(interaction) {
		const tokenAmount = await parseInt(interaction.fields.getTextInputValue('trade_request_token_input')) || 0;

		if (isNaN(tokenAmount) || tokenAmount < 1) {
			const tradeRequestTokenModalEmbedFailed = TradeComponents.tradeRequestTokenModalEmbedFailed;
			tradeRequestTokenModalEmbedFailed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

			return await interaction.update({ content: null, embeds: [tradeRequestTokenModalEmbedFailed], components: [TradeComponents.tradeMainMenuRow] });
		}

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });
		await interaction.client.trades.update({ request: [ ...trade.request.filter(item => item.type != 'token'), { type: 'token', amount: tokenAmount } ] }, { where: { discordinteractionid: interaction.message.interaction.id } });

		Logger.debug(`${this.data.customId} | ${JSON.stringify(trade.request)} --> ${JSON.stringify((await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } })).request)} | (Interaction ${interaction.message.interaction.id})`);

		const tradeAddTokenModalEmbedSuccess = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Trade Offer Creation Menu')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription(`Successfully set tokens in request to **${tokenAmount}** tokens.`);

		await interaction.update({ content: null, embeds: [tradeAddTokenModalEmbedSuccess], components: [TradeComponents.tradeMainMenuRow] });
	},
};