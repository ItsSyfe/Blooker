const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { embedCreator } = require('../util/EmbedHelper');

module.exports = async function(interaction) {
	let username;
	const account = await interaction.client.account.findOne({ where: { discordId: interaction.user.id } });

	if (!account) {
		const noAccountEmbed = await embedCreator(undefined, 'No Blooket accounts linked!', undefined, undefined, 'Please either enter a username or use /link to link your own account to Discord!', undefined, undefined, undefined, undefined, undefined);
		await interaction.editReply({ content: null, embeds: [ noAccountEmbed ] });
		return false;
	}

	if (account.linkedAccounts.length > 1) {
		const multipleAccountsEmbed = new MessageEmbed()
			.setTitle('Multiple accounts linked!')
			.setDescription('Please select the account from the dropdown list below that you wish to view!');

		const options = [];

		for (const linkedAccountUsername of account.linkedAccounts) {
			options.push({
				label: linkedAccountUsername,
				value: linkedAccountUsername,
			});
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
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
			const timeoutEmbed = await embedCreator(undefined, 'Timeout!', undefined, undefined, 'You took too long to respond!', undefined, undefined, undefined, undefined, undefined);
			await interaction.editReply({ content: null, embeds: [ timeoutEmbed ] });
			return false;
		}
	}
	else {
		username = account.linkedAccounts[0];
	}

	return username;
};