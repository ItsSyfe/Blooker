const { EmbedBuilder } = require('discord.js');
const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: {
		customId: 'trade_submit',
	},
	async execute(interaction) {
		const trade = await interaction.client.trades.findOne({ where: { discordinteractionid: interaction.message.interaction.id } });
		const tradeUser = await interaction.client.users.fetch(interaction.user, { force: true });

		const tradePreviewEmbed = new EmbedBuilder()
			.setFooter({ text: `Blooker by Syfe | Trade ID: ${trade.id}`, iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle(`Trade - ${tradeUser.tag}`)
			.setColor(`${tradeUser.hexAccentColor}`)
			.setDescription(`If you'd like to accept this trade, please use the command \`\`/accepttrade <Trade ID>\`\` or use the button below to accept the trade.`)
			.setThumbnail(tradeUser.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: 'Offer', value: trade.offer.length > 0 ? trade.offer.map(item => ` ▸ ${item.fullname || 'Tokens'} \`\`${item.amount}x\`\``).join('\n') : 'No items in offer.', inline: true },
				{ name: 'Request', value: trade.request.length > 0 ? trade.request.map(item => ` ▸ ${item.fullname || 'Tokens'} \`\`${item.amount}x\`\``).join('\n') : 'No items in request.', inline: true },
			);

		await interaction.update({ embeds: [tradePreviewEmbed], components: [ TradeComponents.tradePreviewRow ] });
	},
};