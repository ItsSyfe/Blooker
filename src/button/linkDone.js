const { embedCreator } = require('../util/EmbedHelper');
const ApiHelper = require('../util/ApiHelper');

module.exports = {
	data: {
		customId: 'linkDone',
	},
	async execute(interaction) {
		const account = await interaction.client.account.findOne({ where: { discordId: interaction.user.id } });
		ApiHelper.getLastGameNameFromUsername(account.accountLinking)
			.then(async (gameName) => {
				if (gameName == account.code) {
					const linkedAccounts = account.linkedAccounts;
					linkedAccounts.push(account.accountLinking);
					await interaction.client.account.update({ linkedAccounts }, { where: { discordId: interaction.user.id } });

					const successEmbed = await embedCreator(undefined, 'Successfully linked account!', undefined, undefined, `Successfully linked to account \`\`${account.accountLinking}\`\`!\n\nYou can now use other commands without inputting your username!`, undefined, undefined, undefined, undefined, undefined);
					await interaction.update({ content: null, embeds: [ successEmbed ], components: [ ] });
				}
				else {
					const failEmbed = await embedCreator(undefined, 'Incorrect code!', undefined, undefined, `Got a code of \`\`${gameName}\`\` instead of \`\`${account.code}\`\`\n\nPlease try linking again with /link`, undefined, undefined, undefined, undefined, undefined);
					await interaction.update({ content: null, embeds: [ failEmbed ], components: [ ] });
				}
				await interaction.client.account.update({ code: null, accountLinking: null }, { where: { discordId: interaction.user.id } });
			});
	},
};