const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper');

const rarityToEmoji = {
	'Uncommon': '🟢',
	'Rare': '🔵',
	'Epic': '🔴',
	'Legendary': '🟠',
	'Chroma': '🔷',
	'Mystical': '🟣',
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchbox')
		.setDescription('📖 Search for information on a box!')
		.addStringOption(option =>
			option.setName('box')
				.setDescription('The box you want to search for.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		const box = await BlookHelper.getBoxFullName(interaction.options.getString('box'));

		if (!box) {
			const boxNotFoundEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`Box not found!`)
				.setDescription(`Couldn't find a box with the name \`${interaction.options.getString('box')}\`!`);
			return await interaction.editReply({ content: null, embeds: [ boxNotFoundEmbed ], components: [ ] });
		}

		const blookEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle(box.boxName)
			.setThumbnail(`https://undercovergoose.github.io/blooket-src/market/png/${box.image}.png`)
			.addFields(
				{ name: 'Openable', value: `${box.isOpenable ? '✅' : 'No'}` },
				{ name: 'Token Price', value: `${box.tokenPrice ? `<:newblookettoken:1013531507069042748> ${box.tokenPrice}` : 'Cannot buy box'}` },
				{ name: 'Blooks', value: (await Promise.all(box.blooks.map(async blook => ` ${rarityToEmoji[(await BlookHelper.getBlookByName(blook)).rarity]} ${blook} \`\`${(await BlookHelper.getBlookByName(blook)).chance}%\`\``))).join('\n') },
			);

		await interaction.editReply({ content: null, embeds: [ blookEmbed ], components: [ ] });
	},
};