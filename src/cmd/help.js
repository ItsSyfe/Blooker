const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('📖 See all my commands!'),
	async execute(interaction) {

		const helpEmbed = await new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle('Blooker Help')
			.setImage('https://i.imgur.com/FMy136Z.png')
			.setDescription(`Blooker is a companion bot for [Blooket](https://blooket.com)! We provide useful utility commands that aid you in Blooket, please note that NONE of our commands break Blooket's ToS and we do not have ANY access to your account when using our bot.
			
			**▸ /help •** Brings up this nifty help menu!

			**▸ /profile •** View your Blooket profile and stats! Simply use /profile or /profile <username> to view another user's profile!

			**▸ /blooks •** View all the Blooks you have unlocked! Use /blooks or /blooks <username> to view another user's Blooks!

			**▸ /missingblooks •** Ever wanted to see what Blooks you're missing? Use /missingblooks or /missingblooks <username> to view missing Blooks!

			**▸ /link •** Link your Blooket account to your Discord account! Use /link <username> to link your Discord account to your Blooket account, you can only do this in DMs with me!`);

		await interaction.reply({ content: null, embeds: [ helpEmbed ], components: [ ] });
	},
};