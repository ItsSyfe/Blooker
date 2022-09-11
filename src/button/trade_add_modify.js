const TradeComponents = require('../components/TradeComponents.js');
const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Logger = require('../util/Logger.js');

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
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Trade Offer Creation Menu')
			.setDescription('Use the select menu below to remove items in your offer.')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		const selectMenu = new SelectMenuBuilder()
			.setCustomId('trade_add_modify_select')
			.setPlaceholder('Select an offer to remove.');

		for (const item of trade.offer)  {
			Logger.debug(`${this.data.customId} | Received offer item ${item.fullname || item.type} with amount ${item.amount} | (Interaction ${interaction.message.interaction.id})`);
			if (item.type === 'token') {
				selectMenu.addOptions({ label: `${item.amount} tokens`, value: `token` });
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

		const filter = i => i.customId === 'trade_add_modify_select' && i.user.id === interaction.user.id;

		const collector = interaction.message.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			const itemSelected = i.values[0];
			const tradeOfferItem = trade.offer.find(item => item.shortname === itemSelected || item.type === itemSelected);

			await collector.stop();

			const tradeAddModifyItemEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Trade Offer Creation Menu')
				.setDescription(`You have removed \`\`${tradeOfferItem.fullname ? tradeOfferItem.fullname : 'tokens'}\`\`.`)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

			await interaction.client.trades.update({ offer: trade.offer.filter(item => !(item.shortname === itemSelected || item.type === itemSelected)) }, { where: { discordinteractionid: interaction.message.interaction.id } });
			
			i.update({ content: null, embeds: [tradeAddModifyItemEmbed], components: [TradeComponents.tradeMainMenuRow] });
		});
	},
};