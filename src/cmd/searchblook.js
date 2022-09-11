const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchblook')
		.setDescription('📖 Search for information on a blook!')
		.addStringOption(option =>
			option.setName('blook')
				.setDescription('The blook you want to search for.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		const blook = await BlookHelper.getBlookByName(interaction.options.getString('blook'));

		console.log(blook.length);

		if (blook.length == 1) {
			const blookNotFoundEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`Blook not found!`)
				.setDescription(`Couldn't find a blook with the name \`${interaction.options.getString('blook')}\`!`);
			return await interaction.editReply({ content: null, embeds: [ blookNotFoundEmbed ], components: [ ] });
		}

		const blookBox = await BlookHelper.getBox(blook.box);

		const blookEmbed = new EmbedBuilder()
			.setFooter({ text: `Blooker by Syfe | ${blookBox.boxName}`, iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setColor(`${blook.color}`)
			.setTitle(blook.name)
			.setThumbnail(`https://undercovergoose.github.io/blooket-src/blooks/png/${blook.box}/${blook.id}.png`)
			.addFields(
				{ name: 'Rarity', value: `${blook.rarity}` },
				{ name: 'Count', value: `${blook.count ? `1/${blook.count}` : '1/∞'}` },
				{ name: 'Chance', value: `${blook.chance == -1 ? 'Not obtainable through boxes' : `${blook.chance}%`}` },
				{ name: 'Sell Value', value: `${blook.sellValue == -1 ? 'Cannot sell blook' : `<:newblookettoken:1013531507069042748> ${blook.sellValue}`}` },
			)
			.setFooter({ text: `${blookBox.boxName}` });

		await interaction.editReply({ content: null, embeds: [ blookEmbed ], components: [ ] });
	},
};