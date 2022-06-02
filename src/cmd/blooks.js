const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ApiHelper = require('../util/ApiHelper');
const BlookHelper = require('../util/BlookHelper');
const { embedCreator } = require('../util/EmbedHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blooks')
		.setDescription('View a user\'s blooket blooks!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the blooks of.')),
	async execute(interaction) {
		if (!interaction.inGuild()) {
			const guildOnlyEmbed = await embedCreator(undefined, 'Only available in a server!', undefined, undefined, 'Please make sure to use this command in a discord server! You can join our discord [here](https://discord.gg/8M7CKGWvS2)!', undefined, undefined, undefined, undefined, undefined);
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
			const blooks = await ApiHelper.getBlooksFromUsername(username);

			const MysticalBlooks = await BlookHelper.getBlooksByRarity('Mystical');
			const ChromaBlooks = await BlookHelper.getBlooksByRarity('Chroma');
			const LegendaryBlooks = await BlookHelper.getBlooksByRarity('Legendary');
			const RareBlooks = await BlookHelper.getBlooksByRarity('Rare');
			const UncommonBlooks = await BlookHelper.getBlooksByRarity('Uncommon');

			const MysticalIntersection = Array.from(MysticalBlooks.map(blook => blook.name)).filter(blook => blooks.includes(blook));
			const ChromaIntersection = Array.from(ChromaBlooks.map(blook => blook.name)).filter(blook => blooks.includes(blook));
			const LegendaryIntersection = Array.from(LegendaryBlooks.map(blook => blook.name)).filter(blook => blooks.includes(blook));
			const RareIntersection = Array.from(RareBlooks.map(blook => blook.name)).filter(blook => blooks.includes(blook));
			const UncommonIntersection = Array.from(UncommonBlooks.map(blook => blook.name)).filter(blook => blooks.includes(blook));

			const blookEmbed = await new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${username}'s Blooket Blooks`)
				.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
				.setDescription(`__Stats:__
				**Mysticals Collected:** ${MysticalIntersection.length}/${MysticalBlooks.length} (${Math.round((MysticalIntersection.length / MysticalBlooks.length) * 100)}%)
				**Chromas Collected:** ${ChromaIntersection.length}/${ChromaBlooks.length} (${Math.round((ChromaIntersection.length / ChromaBlooks.length) * 100)}%)
				**Legendaries Collected:** ${LegendaryIntersection.length}/${LegendaryBlooks.length} (${Math.round((LegendaryIntersection.length / LegendaryBlooks.length) * 100)}%)
				**Rares Collected:** ${RareIntersection.length}/${RareBlooks.length} (${Math.round((RareIntersection.length / RareBlooks.length) * 100)}%)
				**Uncommons Collected:** ${UncommonIntersection.length}/${UncommonBlooks.length} (${Math.round((UncommonIntersection.length / UncommonBlooks.length) * 100)}%)`)
				.setFooter('Made with BLOOKS');

			if (MysticalIntersection.length > 0) {
				blookEmbed.addField('Mystical Blooks', `>>> ${MysticalIntersection.join(', ')}`);
			}

			if (ChromaIntersection.length > 0) {
				blookEmbed.addField('Chroma Blooks', `>>> ${ChromaIntersection.join(', ')}`);
			}

			if (LegendaryIntersection.length > 0) {
				blookEmbed.addField('Legendary Blooks', `>>> ${LegendaryIntersection.join(', ')}`);
			}

			if (RareIntersection.length > 0) {
				blookEmbed.addField('Rare Blooks', `>>> ${RareIntersection.join(', ')}`);
			}

			if (UncommonIntersection.length > 0) {
				blookEmbed.addField('Uncommon Blooks', `>>> ${UncommonIntersection.join(', ')}`);
			}

			await interaction.editReply({ content: null, embeds: [ blookEmbed ], components: [ ] });
		}
		catch {
			const accountDoesntExistEmbed = await embedCreator(undefined, 'Can\'t find account!', undefined, undefined, `Couldn't find an account with the username \`\`${username}\`\`, are you sure you've typed the username correct?\n\n*Note: Usernames are case sensitive.*`, undefined, undefined, undefined, undefined, undefined);
			await interaction.editReply({ content: null, embeds: [ accountDoesntExistEmbed ], components: [ ] });
		}
	},
};