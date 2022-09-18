const TradeComponents = require('../components/TradeComponents.js');
const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Logger = require('../util/Logger.js');

module.exports = {
	data: {
		customId: 'trade_request_modify',
	},
	async execute(interaction) {
		const requestItems = (await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } })).request;

		if (requestItems.length === 0) {
			const tradeRequestModifyEmbedNoItems = TradeComponents.tradeRequestModifyEmbedNoItems;
			tradeRequestModifyEmbedNoItems.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });
			
			return await interaction.update({ content: null, embeds: [TradeComponents.tradeRequestModifyEmbedNoItems], components: [TradeComponents.tradeMainMenuRow] });
		}

		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });

		const tradeRequestModifyEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Trade Offer Creation Menu')
			.setDescription('Use the select menu below to remove items in your request.')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

		const selectMenu = new SelectMenuBuilder()
			.setCustomId('trade_request_modify_select')
			.setPlaceholder('Select an request to remove.');

		for (const item of trade.request)  {
			Logger.debug(`${this.data.customId} | Received request item ${item.fullname || item.type} with amount ${item.amount} | (Interaction ${interaction.message.interaction.id})`);
			if (item.type === 'token') {
				selectMenu.addOptions({ label: `${item.amount} tokens`, value: `token` });
				tradeRequestModifyEmbed.addFields({ name: `Tokens`, value: `\`\`${item.amount}x\`\``, inline: true });
			} else if (item.type === 'blook') {
				selectMenu.addOptions({ label: `${item.fullname} ${item.amount}x`, value: `${item.shortname}` });
				tradeRequestModifyEmbed.addFields({ name: `${item.fullname}`, value: `\`\`${item.amount}x\`\``, inline: true });
			}
		}

		const selectMenuRow = new ActionRowBuilder()
			.addComponents(
				selectMenu
			);

		await interaction.update({ content: null, embeds: [tradeRequestModifyEmbed], components: [selectMenuRow, TradeComponents.tradeMainMenuRow] });

		// --------------------------------------------
		// Select menu collector

		const filter = i => i.customId === 'trade_request_modify_select' && i.user.id === interaction.user.id;

		const collector = interaction.message.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			const itemSelected = i.values[0];
			const tradeOfferItem = trade.request.find(item => item.shortname === itemSelected || item.type === itemSelected);

			await collector.stop();

			const tradeRequestModifyItemEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Trade Offer Creation Menu')
				.setDescription(`You have removed \`\`${tradeOfferItem.fullname ? tradeOfferItem.fullname : 'tokens'}\`\`.`)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

			await interaction.client.trades.update({ request: trade.request.filter(item => !(item.shortname === itemSelected || item.type === itemSelected)) }, { where: { discordinteractionid: interaction.message.interaction.id } });
			
			i.update({ content: null, embeds: [tradeRequestModifyItemEmbed], components: [TradeComponents.tradeMainMenuRow] });
		});
	},
};