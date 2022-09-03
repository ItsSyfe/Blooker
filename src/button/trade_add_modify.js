const TradeComponents = require('../components/TradeComponents.js');
const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		customId: 'trade_add_modify',
	},
	async execute(interaction) {
		const offerItems = (await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } })).offer;

		if (offerItems.length === 0) {
			const tradeAddModifyEmbedNoItems = TradeComponents.tradeAddModifyEmbedNoItems;
			tradeAddModifyEmbedNoItems.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });
			
			return await interaction.update({ content: null, embeds: [TradeComponents.tradeAddModifyEmbedNoItems], components: [TradeComponents.tradeMainMenuRow] });
		}

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });

		const tradeAddModifyEmbed = new EmbedBuilder()
			.setTitle('Trade Offer Creation Menu')
			.setColor('#990000')
			.setDescription('Use the select menu below to remove items from your offer.')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		const selectMenu = new SelectMenuBuilder()
			.setCustomId('trade_add_modify_select')
			.setPlaceholder('Select an offer to remove.');

		for (const item of trade.offer)  {
			if (item.type === 'token') {
				selectMenu.addOptions({ label: `${item.amount} tokens`, value: `remove_token` });
				tradeAddModifyEmbed.addFields({ name: `Tokens`, value: `\`\`${item.amount}x\`\``, inline: true });
			} else if (item.type === 'blook') {
				selectMenu.addOptions({ label: `${item.fullname} ${item.amount}x`, value: `${item.shortname}` });
				tradeAddModifyEmbed.addFields({ name: `${item.fullname}`, value: `\`\`${item.amount}x\`\``, inline: true });
			}
		}

		const selectMenuRow = new ActionRowBuilder()
			.addComponents(
				selectMenu
			);

		await interaction.update({ content: null, embeds: [tradeAddModifyEmbed], components: [selectMenuRow, TradeComponents.tradeMainMenuRow] });

		// --------------------------------------------
		// Select menu collector
	},
};