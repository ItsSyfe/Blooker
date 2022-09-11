const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🏓 Test my response time!'),
	async execute(interaction) {
		await interaction.reply('Pinging...');

		await interaction.fetchReply()
			.then (reply => {
				const pingEmbed = new EmbedBuilder()
					.setColor('#0cc3ce')
					.setFooter({ text: 'Blooker by Syfe', iconURL: interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
					.setTitle('Pong! 🏓')
					.setDescription(`⌛ **Time:** ${reply.createdTimestamp - interaction.createdTimestamp} ms\n⏱️ **WS:** ${interaction.client.ws.ping} ms`);
				
				interaction.editReply({ content: null, embeds: [ pingEmbed ] });
			});
	},
};