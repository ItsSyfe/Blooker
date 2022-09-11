const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = async function(interaction) {
	let username;
	const account = await interaction.client.account.findOne({ where: { discordId: interaction.user.id } });

	if (!account) {
		const noAccountEmbed = new EmbedBuilder()
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setColor(`#990000`)
			.setTitle(`No Blooket accounts linked!`)
			.setDescription(`Please either enter a username or use /link to link your own account to Discord!`);
			
		await interaction.editReply({ content: null, embeds: [ noAccountEmbed ] });
		return false;
	}

	if (account.linkedAccounts.length > 1) {
		const multipleAccountsEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Multiple accounts linked!')
			.setDescription('Please select the account from the dropdown list below that you wish to view!');

		const options = [];

		for (const linkedAccountUsername of account.linkedAccounts) {
			options.push({
				label: linkedAccountUsername,
				value: linkedAccountUsername,
			});
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Please select an account')
					.addOptions(options),
			);

		await interaction.editReply({ content: null, embeds: [ multipleAccountsEmbed ], components: [ row ], fetchReply: true });

		const filter = i => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const success = await interaction.fetchReply()
			.then(reply => reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
				.then(MenuInteraction => username = MenuInteraction.values[0])
				.catch(() => {
					return false;
				}));

		if (!success) {
			const timeoutEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`Timeout!`)
				.setDescription(`You took too long to respond!`);

			await interaction.editReply({ content: null, embeds: [ timeoutEmbed ] });
			return false;
		}
	}
	else {
		username = account.linkedAccounts[0];
	}

	return username;
};