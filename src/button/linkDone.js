const { EmbedBuilder } = require('discord.js')
const BlooketAccountHelper = require('../util/BlooketAccountHelper');

module.exports = {
	data: {
		customId: 'linkDone',
	},
	async execute(interaction) {
		const account = await interaction.client.account.findOne({ where: { discordId: interaction.user.id } });
		BlooketAccountHelper.getLastGameNameFromUsername(account.accountLinking)
			.then(async (gameName) => {
				if (gameName == account.code) {
					const linkedAccounts = account.linkedAccounts;
					linkedAccounts.push(account.accountLinking);
					await interaction.client.account.update({ linkedAccounts }, { where: { discordId: interaction.user.id } });

					const successEmbed = new EmbedBuilder()
						.setColor('#0cc3ce')
						.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
						.setTitle('Successfully linked account!')
						.setDescription(`Successfully linked to account \`\`${account.accountLinking}\`\`!\n\nYou can now use other commands without inputting your username!`)
					await interaction.update({ content: null, embeds: [ successEmbed ], components: [ ] });
				}
				else {
					const failEmbed = new EmbedBuilder()
						.setColor('#990000')
						.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
						.setTitle('Incorrect code!')
						.setDescription(`Got a code of \`\`${gameName}\`\` instead of \`\`${account.code}\`\`\n\nPlease try linking again with /link`)
					await interaction.update({ content: null, embeds: [ failEmbed ], components: [ ] });
				}
				await interaction.client.account.update({ code: null, accountLinking: null }, { where: { discordId: interaction.user.id } });
			});
	},
};