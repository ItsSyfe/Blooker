const { MessageActionRow, MessageButton } = require('discord.js');
const { embedCreator } = require('../util/EmbedHelper');
const ApiHelper = require('../util/ApiHelper');

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
		if (await ApiHelper.checkAccountExists(blooketUsername)) {
			const code = makeCode(6);
			const dmEmbed = await embedCreator(undefined, 'Linking process (Step two)', undefined, undefined, `To verify you own the account \`\`${blooketUsername}\`\`, we require you to enter a blooket game with a code as your username, this allows us to do verification.\n\nYour code: ${code}\n\nPlease enter a game and set this as your username, then leave the game, once you've done this click the 'Done' button below.`, undefined, undefined, undefined, undefined, undefined);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('linkDone')
						.setLabel('Done')
						.setStyle('SUCCESS'),

					new MessageButton()
						.setCustomId('linkCancel')
						.setLabel('Cancel')
						.setStyle('DANGER'),
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
			const accountDoesntExistEmbed = await embedCreator(undefined, 'Account doesn\'t exist!', undefined, undefined, `Couldn't find an account with the username ${blooketUsername}, are you sure you've typed your username correct? To try linking again use /link\n\n*Note: Usernames are case sensitive*`, undefined, undefined, undefined, undefined, undefined);
			await interaction.reply({ content: null, embeds: [ accountDoesntExistEmbed ] });
		}
	},
};