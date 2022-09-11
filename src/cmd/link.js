const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('🔗 Link your Blooket accounts to your Discord account.'),
	async execute(interaction) {
		if (interaction.inGuild()) {
			const dmEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Initiate linking process.')
				.setDescription('To start linking your Blooket account, simply run the command /link');
			interaction.member.send({ content: null, embeds: [ dmEmbed ] });

			const guildEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Only available in direct messages!')
				.setDescription('To make the linking process easier you have to do this in DMs! Please go to your direct messages as I\'ve messaged you with instructions on what to do next!');
			return await interaction.reply({ content: null, embeds: [ guildEmbed ] });
		}

		const blooketAccountInput = new TextInputBuilder()
			.setCustomId('blooketAccountInput')
			.setLabel('Please enter your Blooket account name.')
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder()
			.addComponents(blooketAccountInput);

		const modal = new ModalBuilder()
			.setCustomId('linkModal')
			.setTitle('Blooket Account Linking')
			.addComponents(firstActionRow);

		await interaction.showModal(modal);
	},
};