const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedCreator } = require('../util/EmbedHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🏓 Test my response time!'),
	async execute(interaction) {
		await interaction.reply('Pinging...');

		interaction.fetchReply()
			.then (reply => {
				const pingEmbed = embedCreator(undefined, 'Pong! 🏓', undefined, undefined, `⌛ **Time:** ${reply.createdTimestamp - interaction.createdTimestamp} ms\n⏱️ **WS:** ${interaction.client.ws.ping} ms`, undefined, undefined, undefined, undefined);

				interaction.editReply({ content: null, embeds: [ pingEmbed ] });
			});
	},
};