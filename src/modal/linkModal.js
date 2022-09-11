const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');

function makeCode(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = {
	data: {
		customId: 'linkModal',
	},
	async execute(interaction) {
		const blooketUsername = interaction.fields.getTextInputValue('blooketAccountInput');
		if (await BlooketAccountHelper.doesUserExist(blooketUsername)) {
			const code = makeCode(6);
			const dmEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Linking process (Step two)')
				.setDescription(`To verify you own the account \`\`${blooketUsername}\`\`, we require you to enter a blooket game with a code as your username, this allows us to do verification.\n\nYour code: ${code}\n\nPlease enter a game and set this as your username, finish and leave the game, once you've done this click the 'Done' button below.`);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('linkDone')
						.setLabel('Done')
						.setStyle(ButtonStyle.Success),

					new ButtonBuilder()
						.setCustomId('linkCancel')
						.setLabel('Cancel')
						.setStyle(ButtonStyle.Danger),
				);

			await interaction.reply({ content: null, embeds: [ dmEmbed ], components: [ row ] });

			let userAccount = await interaction.client.account.findOne({ where: { discordId: interaction.user.id } });

			if (!userAccount) {
				userAccount = await interaction.client.account.create({
					discordId: interaction.user.id,
					linkedAccounts: [ ],
				});
			}

			await interaction.client.account.update({ code: code, accountLinking: blooketUsername }, { where: { discordId: interaction.user.id } });
		}
		else {
			const accountDoesntExistEmbed = new EmbedBuilder()
				.setColor('#990000')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Account doesn\'t exist!')
				.setDescription(`Couldn't find an account with the username \`\`${blooketUsername}\`\`, are you sure you've typed your username correct? To try linking again use /link\n\n*Note: Usernames are case sensitive*`);
			await interaction.reply({ content: null, embeds: [ accountDoesntExistEmbed ] });
		}
	},
};