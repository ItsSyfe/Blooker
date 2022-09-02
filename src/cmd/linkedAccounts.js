const { embedCreator } = require('../util/EmbedHelper');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ApiHelper = require('../util/ApiHelper');
const BlookHelper = require('../util/BlookHelper');

function abbreviateNumber(value) {
	let newValue = value;
	if (value >= 1000) {
		const suffixes = ['', 'K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n'];
		const suffixNum = Math.floor(('' + value).length / 3);
		let shortValue = '';
		for (let precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
			const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
			if (dotLessShortValue.length <= 2) { break; }
		}
		if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
		newValue = shortValue + suffixes[suffixNum];
	}
	return newValue;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linkedaccounts')
		.setDescription('🔗 See what Blooket accounts a user has linked to their discord!')
		.addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		const account = await interaction.client.account.findOne({ where: { discordId: user ? user.id : interaction.user.id } });

		if (!account || !account.linkedAccounts.length > 0) {
			const noAccount = await embedCreator(undefined, 'No linked accounts!', undefined, undefined, 'If this is your Discord account, use /link to link a blooket account to your discord!', undefined, undefined, undefined, undefined, undefined);
			return await interaction.reply({ content: null, embeds: [ noAccount ] });
		}

		await interaction.deferReply();

		const linkedAccountsEmbed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`${user ? user.username : interaction.user.username}'s linked accounts`)
			.setDescription('These accounts are proven to be owned by this Discord user.');

		for (const username of account.linkedAccounts) {
			const blooketAccount = await ApiHelper.getAccountFromUsername(username);
			const blooks = Object.keys(blooketAccount.unlocks);
			linkedAccountsEmbed.addFields({ name: `${blooketAccount.name}${blooketAccount.plan == 'Plus' ? ' **+**' : ''}`,
				value: `>>> **Blook Collection:** ${blooks.length}/${BlookHelper.getBlooks().length} (${Math.round(blooks.length / BlookHelper.getBlooks().length * 100)}% complete)
				**Tokens:** ${abbreviateNumber(blooketAccount.tokens)}
				**Total Tokens:** ${abbreviateNumber(blooketAccount.totalTokens)}
				**Boxes Opened:** ${abbreviateNumber(blooketAccount.boxesOpened)}
				**Wins:** ${blooketAccount.wins} (${Math.round(blooketAccount.wins / blooketAccount.gamesPlayed * 100)}% win rate)`});
		}

		await interaction.editReply({ content: null, embeds: [ linkedAccountsEmbed ] });
	},
};