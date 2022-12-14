const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('š Test my response time!'),
	async execute(interaction) {
		await interaction.reply('Pinging...');

		await interaction.fetchReply()
			.then (async (reply) => {
				const pingEmbed = new EmbedBuilder()
					.setColor('#0cc3ce')
					.setTitle('Pong! š')
					.setDescription(`ā **Time:** ${reply.createdTimestamp - interaction.createdTimestamp} ms\nā±ļø **WS:** ${interaction.client.ws.ping} ms\nBlooket API Latency: ${Math.round(await BlooketAccountHelper.getApiLatency())} ms`);
				
				await interaction.editReply({ content: null, embeds: [ pingEmbed ] });
			});
	},
};