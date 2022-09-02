const { SlashCommandBuilder } = require('discord.js');
const TradeComponents = require('../components/TradeComponents.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trade')
		.setDescription('Create a trade request to put onto the market.'),
	async execute(interaction) {
		const tradeMenuEmbed = TradeComponents.tradeMenuEmbed;
		tradeMenuEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });
		
		await interaction.reply({ content: null, embeds: [TradeComponents.tradeMenuEmbed], components: [TradeComponents.tradeMenuRow] });

		await interaction.client.trades.create({
			discordid: interaction.user.id,
			tradestatus: 'pending',
			discordinteractionid: interaction.id,
			offer: [],
			request: [],
		})
	},
};