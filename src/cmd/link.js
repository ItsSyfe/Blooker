const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedCreator } = require('../util/EmbedHelper');
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('🔗 Link your Blooket accounts to your Discord account.'),
	async execute(interaction) {
		if (interaction.inGuild()) {
			const dmEmbed = await embedCreator(undefined, 'Initiate linking process.', undefined, undefined, 'To start linking your Blooket account, simply run the command /link', undefined, undefined, undefined, undefined, undefined);
			interaction.member.send({ content: null, embeds: [ dmEmbed ] });

			const guildEmbed = await embedCreator(undefined, 'Only available in direct messages!', undefined, undefined, 'To make the linking process easier you have to do this in DMs! Please go to your direct messages as I\'ve messaged you with instructions on what to do next!', undefined, undefined, undefined, undefined, undefined);
			return await interaction.reply({ content: null, embeds: [ guildEmbed ] });
		}

		const modal = new Modal()
			.setCustomId('linkModal')
			.setTitle('Blooket Account Linking');

		const blooketAccountInput = new TextInputComponent()
			.setCustomId('blooketAccountInput')
			.setLabel('Please enter your Blooket account name.')
			.setStyle('SHORT');

		const firstActionRow = new MessageActionRow().addComponents(blooketAccountInput);

		modal.addComponents(firstActionRow);

		await interaction.showModal(modal);
	},
};