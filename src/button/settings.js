module.exports = {
	data: {
		customId: 'settings',
	},
	async execute(interaction) {
		await interaction.deferUpdate();
	},
};