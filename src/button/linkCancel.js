const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		customId: 'linkCancel',
	},
	async execute(interaction) {
		await interaction.client.account.update({ code: null, accountLinking: null }, { where: { discordId: interaction.user.id } });

		const linkCancel = new EmbedBuilder()
			.setColor('#990000')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Cancelled Linking process')
			.setDescription('To try link your account again, use /link');
		await interaction.update({ content: null, embeds: [ linkCancel ], components: [ ] });
	},
};