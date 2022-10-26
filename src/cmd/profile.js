const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');
const BlookHelper = require('../util/BlookHelper');
const Logger = require('../util/Logger');

const abbreviateNumber = require('number-abbreviate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('View a user\'s blooket profile and stats!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the profile of.')),
	async execute(interaction) {
		if (!interaction.inGuild()) {
			const guildOnlyEmbed = new EmbedBuilder()
				.setColor('#990000')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Only available in a server!')
				.setDescription('Please make sure to use this command in a discord server! You can join our discord [here](https://discord.gg/8M7CKGWvS2)!');

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
			const accountInfo = await BlooketAccountHelper.fetchAccountByUsername(username);
			
			const favouriteBlook = await BlookHelper.getBlookInfo(accountInfo.blook);
			const date = Date.parse(accountInfo.dateCreated);
			const profileEmbed = await new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: `Blooker by Syfe | 💳 ID: ${accountInfo._id.toString()}`, iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(favouriteBlook.color != undefined ? favouriteBlook.color : '#0099ff')
				.setTitle(`${accountInfo.name}'s Profile${accountInfo.plan == 'Plus' ? ' **+**' : ''}`)
				.setURL(`https://dashboard.blooket.com/stats?name=${accountInfo.name}`)
				.setThumbnail(favouriteBlook ? `https://undercovergoose.github.io/blooket-src/blooks/${favouriteBlook.box}/${favouriteBlook.id}.png` : '')
				.setDescription(`**▸ 🏆 Wins:** ${accountInfo.wins} (${Math.round(accountInfo.wins / accountInfo.gamesPlayed * 100)}% win rate)

**▸ 🎖️ Top Five Placements:** ${accountInfo.topFives}

**▸ 🎲 Total Games Played:** ${abbreviateNumber(accountInfo.gamesPlayed)}

**▸ <:newblookettoken:1013531507069042748> Tokens:** ${abbreviateNumber(accountInfo.tokens)}

**▸ 🎯 Daily Tokens Available:** ${new Date().setHours(0, 0, 0, 0) != Date.parse(accountInfo.lastTokenDay) && accountInfo.tokensAvailable == 0 ? '500' : accountInfo.tokensAvailable}

**▸ 🧪 XP:** ${accountInfo.xp}

**▸ 🎯 Daily XP Available:** ${new Date().setHours(0, 0, 0, 0) != Date.parse(accountInfo.lastTokenDay) && accountInfo.xpAvailable == 0 ? '300' : accountInfo.xpAvailable}

**▸ <:newblookettoken:1013531507069042748> Total Tokens Earned:** ${abbreviateNumber(accountInfo.totalTokens)}

**▸ 🔓 Boxes Opened:** ${abbreviateNumber(accountInfo.boxesOpened)}

**▸ ♻️ Server reset time:** <t:${Math.round(new Date().setHours(24, 0, 0, 0)) / 1000}:R>


⌛ Created: <t:${Math.floor(date.valueOf() / 1000)}:R> • ${accountInfo.dateCreated.replace(/T/, ' ').replace(/\..+/, '')}`);

			await interaction.editReply({ content: null, embeds: [ profileEmbed ], components: [ ] });
		}
		catch (e) {
			const accountDoesntExistEmbed = new EmbedBuilder()
				.setColor('#990000')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Can\'t find account!')
				.setDescription(`Couldn't find an account with the username \`\`${username}\`\`, are you sure you've typed the username correct?\n\n*Note: Usernames are case sensitive.*`);
			await interaction.editReply({ content: null, embeds: [ accountDoesntExistEmbed ], components: [ ] });
			console.log(e);
		}
	},
};