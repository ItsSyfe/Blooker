const { SlashCommandBuilder } = require('@discordjs/builders');
const ApiHelper = require('../util/ApiHelper');
const { MessageEmbed } = require('discord.js');

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
		.setName('profile')
		.setDescription('View a user\'s blooket profile and stats!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the profile of.')
				.setRequired(true)),
	async execute(interaction) {
		const username = interaction.options.getString('username');
		await interaction.deferReply();
		// try {
		const Account = await ApiHelper.getAccountFromUsername(username);

		const profileEmbed = await new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${Account.name}${Account.plan == 'Plus' ? ' **+**' : ''}`)
			.setURL(`https://dashboard.blooket.com/stats?name=${Account.name}`)
			.setDescription(`__Details:__
				**Tokens:** ${abbreviateNumber(Account.tokens)}
				**Total Tokens:** ${abbreviateNumber(Account.totalTokens)}
				**Boxes Opened:** ${abbreviateNumber(Account.boxesOpened)} 
				**Daily Token Available:** ${Account.tokensAvailable}
				**Daily XP Available:** ${Account.xpAvailable}
				**Time Before Reset:** <t:${Math.round(new Date().setHours(24, 0, 0, 0)) / 1000}:R>`)
			.addFields(
				{ name: 'Wins', value: `> ${Account.wins} (${Math.round(Account.wins / Account.gamesPlayed * 100)}% win rate)`, inline: true },
				{ name: 'Showdown Wins', value: `> ${abbreviateNumber(Account.showdownWins)} wins`, inline: true },
				{ name: 'Top 5s', value: `> ${Account.topFives}`, inline: true },
				{ name: 'Players Defeated', value: `> ${abbreviateNumber(Account.playersDefeated)} players`, inline: true },
				{ name: 'Correct Answers', value: `> ${abbreviateNumber(Account.correctAnswers)} answers`, inline: true },
				{ name: 'Games Played', value: `> ${abbreviateNumber(Account.gamesPlayed)} games`, inline: true },
				{ name: 'Total Points', value: `> ${abbreviateNumber(Account.classicPoints)} points`, inline: true },
				{ name: 'Total Crypto', value: `> ${abbreviateNumber(Account.totalCrypto)} crypto`, inline: true },
				{ name: 'Total Gold', value: `> ${abbreviateNumber(Account.totalGold)} gold`, inline: true },
				{ name: 'Total Fish Weight', value: `> ${abbreviateNumber(Account.totalFishWeight)} fish weight`, inline: true },
				{ name: 'Total Cash', value: `> ${abbreviateNumber(Account.totalCash)} cash`, inline: true },
				{ name: 'Racing Progress', value: `> ${abbreviateNumber(Account.racingProgress)} progress`, inline: true },
				{ name: 'Factory Upgrades', value: `> ${abbreviateNumber(Account.upgrades)} upgrades`, inline: true },
			)
			.setTimestamp(Date.parse(Account.dateCreated))
			.setFooter(`Account ID: ${Account._id.toString()}`);

		await interaction.editReply({ content: null, embeds: [ profileEmbed ] });
		/*
		}
		catch {
			await interaction.editReply({ content: `Couldn't find a profile for user ${username}, are you sure that username is correct?`, ephemeral: true });
		}
		*/
	},
};