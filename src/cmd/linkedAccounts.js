const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');
const BlookHelper = require('../util/BlookHelper');
const abbreviateNumber = require('number-abbreviate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linkedaccounts')
		.setDescription('🔗 See what Blooket accounts a user has linked to their discord!')
		.addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		await interaction.deferReply();

		const user = interaction.options.getUser('target') || interaction.user;
		const account = await interaction.client.account.findOne({ where: { discordId: user.id } });

		if (!account || account.linkedAccounts.length == 0) {
			const accountNoExistEmbed = new EmbedBuilder()
				.setColor('#990000')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('No linked accounts!')
				.setDescription(`User has no linked accounts!\n\n*You can use \`/link\` to link a Blooket account to Blooker!*`);
			return await interaction.editReply({ embeds: [ accountNoExistEmbed ] });
		}

		const linkedAccounts = account.linkedAccounts;

		const linkedAccountsEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle(`${user.username}'s Linked Accounts`)
			.setDescription(`These accounts have been verified as belonging to ${user.username}.\n*You can use \`/link\` to link a Blooket account to Blooker!*`);

		for (let i = 0; i < linkedAccounts.length; i++) {
			const accountInfo = await BlooketAccountHelper.fetchAccountByUsername(linkedAccounts[i]);
			const accountUnlocks = Object.keys(accountInfo.unlocks || {});
			linkedAccountsEmbed.addFields({ name: linkedAccounts[i], value: 
				`>>> **Collection**: ${accountUnlocks.length}/${await BlookHelper.obtainableBlookCount()} \`(${Math.round((accountUnlocks.length / await BlookHelper.obtainableBlookCount() * 100) * 100) / 100}%)\`
				**Tokens:** ${abbreviateNumber(accountInfo.tokens)}
				**Wins:** ${accountInfo.wins} (${Math.round((accountInfo.wins / accountInfo.gamesPlayed * 100) * 100) / 100}% win rate)` 
			});
		}

		await interaction.editReply({ embeds: [ linkedAccountsEmbed ] });
	},
};