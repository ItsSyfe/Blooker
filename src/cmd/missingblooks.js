const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ApiHelper = require('../util/ApiHelper');
const BlookHelper = require('../util/BlookHelper');
const { embedCreator } = require('../util/EmbedHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('missingblooks')
		.setDescription('View a user\'s missing blooket blooks!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the missing blooks of.')),
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
			let unlocks = await ApiHelper.getBlooksFromUsername(username);

			unlocks = unlocks ? unlocks : [];

			const blooks = Object.keys(unlocks);

			const MysticalBlooks = await BlookHelper.getBlooksByRarity('Mystical');
			const ChromaBlooks = await BlookHelper.getBlooksByRarity('Chroma');
			const LegendaryBlooks = await BlookHelper.getBlooksByRarity('Legendary');
			const EpicBlooks = await BlookHelper.getBlooksByRarity('Epic');
			const RareBlooks = await BlookHelper.getBlooksByRarity('Rare');
			const UncommonBlooks = await BlookHelper.getBlooksByRarity('Uncommon');

			const MysticalDifference = MysticalBlooks.filter(blook => !blooks.includes(blook));
			const ChromaDifference = ChromaBlooks.filter(blook => !blooks.includes(blook));
			const LegendaryDifference = LegendaryBlooks.filter(blook => !blooks.includes(blook));
			const EpicDifference = EpicBlooks.filter(blook => !blooks.includes(blook));
			const RareDifference = RareBlooks.filter(blook => !blooks.includes(blook));
			const UncommonDifference = UncommonBlooks.filter(blook => !blooks.includes(blook));

			let description = '__Stats:__';

			if (MysticalDifference.length > 0) {
				description += `\n**Mysticals Missing:** ${MysticalDifference.length}/${MysticalBlooks.length} (${Math.round((MysticalDifference.length / MysticalBlooks.length) * 100)}%)`;
			}

			if (ChromaDifference.length > 0) {
				description += `\n**Chromas Missing:** ${ChromaDifference.length}/${ChromaBlooks.length} (${Math.round((ChromaDifference.length / ChromaBlooks.length) * 100)}%)`;
			}

			if (LegendaryDifference.length > 0) {
				description += `\n**Legendaries Missing:** ${LegendaryDifference.length}/${LegendaryBlooks.length} (${Math.round((LegendaryDifference.length / LegendaryBlooks.length) * 100)}%)`;
			}

			if (EpicDifference.length > 0) {
				description += `\n**Epics Missing:** ${EpicDifference.length}/${EpicBlooks.length} (${Math.round((EpicDifference.length / EpicBlooks.length) * 100)}%)`;
			}

			if (RareDifference.length > 0) {
				description += `\n**Rares Missing:** ${RareDifference.length}/${RareBlooks.length} (${Math.round((RareDifference.length / RareBlooks.length) * 100)}%)`;
			}

			if (UncommonDifference.length > 0) {
				description += `\n**Uncommons Missing:** ${UncommonDifference.length}/${UncommonBlooks.length} (${Math.round((UncommonDifference.length / UncommonBlooks.length) * 100)}%)`;
			}

			if (MysticalDifference.length == 0 && ChromaDifference.length == 0 && LegendaryDifference.length == 0 && RareDifference.length == 0 && UncommonDifference.length == 0) {
				description += '\n**No Missing Blooks!**';
			}

			const blookEmbed = await new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${username}'s Missing Blooket Blooks`)
				.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
				.setDescription(description);

			if (MysticalDifference.length > 0) {
				blookEmbed.addField('Missing Mystical Blooks', `>>> ${MysticalDifference.join(', ')}`);
			}

			if (ChromaDifference.length > 0) {
				blookEmbed.addField('Missing Chroma Blooks', `>>> ${ChromaDifference.join(', ')}`);
			}

			if (LegendaryDifference.length > 0) {
				blookEmbed.addField('Missing Legendary Blooks', `>>> ${LegendaryDifference.join(', ')}`);
			}

			if (EpicDifference.length > 0) {
				blookEmbed.addField('Missing Epic Blooks', `>>> ${EpicDifference.join(', ')}`);
			}

			if (RareDifference.length > 0) {
				blookEmbed.addField('Missing Rare Blooks', `>>> ${RareDifference.join(', ')}`);
			}

			if (UncommonDifference.length > 0) {
				blookEmbed.addField('Missing Uncommon Blooks', `>>> ${UncommonDifference.join(', ')}`);
			}

			await interaction.editReply({ content: null, embeds: [ blookEmbed ], components: [ ] });
		}
		catch {
			const accountDoesntExistEmbed = await embedCreator(undefined, 'Can\'t find account!', undefined, undefined, `Couldn't find an account with the username \`\`${username}\`\`, are you sure you've typed the username correct?\n\n*Note: Usernames are case sensitive.*`, undefined, undefined, undefined, undefined, undefined);
			await interaction.editReply({ content: null, embeds: [ accountDoesntExistEmbed ], components: [ ] });
		}
	},
};