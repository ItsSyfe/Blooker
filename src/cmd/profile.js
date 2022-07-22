const { SlashCommandBuilder } = require('@discordjs/builders');
const ApiHelper = require('../util/ApiHelper');
const { MessageEmbed } = require('discord.js');
const { embedCreator } = require('../util/EmbedHelper');
const BlookHelper = require('../util/BlookHelper');
const { debug } = require('../util/Logger');

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
				.setDescription('The username of the user you want to view the profile of.')),
	async execute(interaction) {
		if (!interaction.inGuild()) {
			const guildOnlyEmbed = await embedCreator(undefined, 'Only available in a server!', undefined, undefined, 'Please make sure to use this command in a discord server! You can join our discord [here](https://discord.gg/8M7CKGWvS2)!', undefined, undefined, undefined, undefined, undefined);
			return await interaction.reply({ content: null, embeds: [ guildOnlyEmbed ] });
		}

		let username = interaction.options.getString('username');
		await interaction.deferReply();

		if (!username) {
			const result = await (require('../util/AccountHelper'))(interaction);
			if (!result) {
				return;
			}

			username = result;
		}
		try {
			const Account = await ApiHelper.getAccountFromUsername(username);

			const favouriteBlook = await BlookHelper.getBlook(Object.keys(Account.blookUsage).reduce((a, b) => Account.blookUsage[a] > Account.blookUsage[b] ? a : b));
			const date = Date.parse(Account.dateCreated);
			const profileEmbed = await new MessageEmbed()
				.setColor(favouriteBlook.color != undefined ? favouriteBlook.color : '#0099ff')
				.setTitle(`${Account.name}'s Profile${Account.plan == 'Plus' ? ' **+**' : ''}`)
				.setURL(`https://dashboard.blooket.com/stats?name=${Account.name}`)
				.setThumbnail(`https://undercovergoose.github.io/blooket-src/blooks/png/${favouriteBlook.box}/${favouriteBlook.id}.png`)
				.setDescription(`**▸ 🏆 Wins:** ${Account.wins} (${Math.round(Account.wins / Account.gamesPlayed * 100)}% win rate)

					**▸ 🎖️ Top Five Placements:** ${Account.topFives}

					**▸ 🎲 Total Games Played:** ${abbreviateNumber(Account.gamesPlayed)}

					**▸ <:b_token:998636743941173288> Tokens:** ${abbreviateNumber(Account.tokens)}

					**▸ 🎯 Daily Tokens Available:** ${new Date().setHours(0, 0, 0, 0) != Date.parse(Account.lastTokenDay) && Account.tokensAvailable == 0 ? '500' : Account.tokensAvailable}

					**▸ 🧪 XP:** ${Account.xp}

					**▸ 🎯 Daily XP Available:** ${new Date().setHours(0, 0, 0, 0) != Date.parse(Account.lastTokenDay) && Account.xpAvailable == 0 ? '300' : Account.xpAvailable}

					**▸ <:b_token:998636743941173288> Total Tokens Earned:** ${abbreviateNumber(Account.totalTokens)}

					**▸ 🔓 Unlock count:** ${abbreviateNumber(Account.boxesOpened)}

					**▸ 🍱 Boxes Opened:** ${abbreviateNumber(Account.boxesOpened)} 

					**▸ ♻️ Server reset time:** <t:${Math.round(new Date().setHours(24, 0, 0, 0)) / 1000}:R>

					
					⌛ Created: <t:${Math.floor(date.valueOf() / 1000)}:R> • ${Account.dateCreated.replace(/T/, ' ').replace(/\..+/, '')}`)
				.setFooter({ text: `💳 ID: ${Account._id.toString()}` });

			await interaction.editReply({ content: null, embeds: [ profileEmbed ], components: [ ] });
		}
		catch (e) {
			const accountDoesntExistEmbed = await embedCreator(undefined, 'Can\'t find account!', undefined, undefined, `Couldn't find an account with the username \`\`${username}\`\`, are you sure you've typed the username correct?\n\n*Note: Usernames are case sensitive.*`, undefined, undefined, undefined, undefined, undefined);
			await interaction.editReply({ content: null, embeds: [ accountDoesntExistEmbed ], components: [ ] });
			debug(e);
		}
	},
};