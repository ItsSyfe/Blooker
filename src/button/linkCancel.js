const { embedCreator } = require('../util/EmbedHelper');

module.exports = {
	data: {
		customId: 'linkCancel',
	},
	async execute(interaction) {
		await interaction.client.account.update({ code: null, accountLinking: null }, { where: { discordId: interaction.user.id } });

		const linkCancel = await embedCreator(undefined, 'Cancelled Linking process', undefined, undefined, 'To try link your account again, use /link', undefined, undefined, undefined, undefined, undefined);
		await interaction.update({ content: null, embeds: [ linkCancel ], components: [ ] });
	},
};