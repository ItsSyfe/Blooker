const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
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
			const unlocks = await ApiHelper.getBlooksFromUsername(username);

			if (!unlocks) {
				const noBlooksEmbed = await new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle(`${username}'s Inventory`)
					.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
					.setDescription('**▸ Account has no blooks.**');
				return await interaction.editReply({ content: null, embeds: [ noBlooksEmbed ], components: [ ] });
			}

			const blooks = Object.keys(unlocks);

			const AllBlooks = await BlookHelper.getBlooks();
			const MysticalBlooks = await BlookHelper.getBlooksByRarity('Mystical');
			const ChromaBlooks = await BlookHelper.getBlooksByRarity('Chroma');
			const LegendaryBlooks = await BlookHelper.getBlooksByRarity('Legendary');
			const EpicBlooks = await BlookHelper.getBlooksByRarity('Epic');
			const RareBlooks = await BlookHelper.getBlooksByRarity('Rare');
			const UncommonBlooks = await BlookHelper.getBlooksByRarity('Uncommon');

			const AllIntersection = AllBlooks.filter(blook => blooks.includes(blook));
			const MysticalIntersection = MysticalBlooks.filter(blook => blooks.includes(blook));
			const ChromaIntersection = ChromaBlooks.filter(blook => blooks.includes(blook));
			const LegendaryIntersection = LegendaryBlooks.filter(blook => blooks.includes(blook));
			const EpicIntersection = EpicBlooks.filter(blook => blooks.includes(blook));
			const RareIntersection = RareBlooks.filter(blook => blooks.includes(blook));
			const UncommonIntersection = UncommonBlooks.filter(blook => blooks.includes(blook));

			let sellValue = 0;

			for (const blook of AllIntersection) {
				const blookData = await BlookHelper.getBlook(blook);
				sellValue += blookData.sellValue > 0 ? blookData.sellValue * unlocks[blook] : 0;
			}

			const navRow = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('overview')
						.setLabel('Overview')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('blooks')
						.setLabel('All Blooks')
						.setStyle(ButtonStyle.Primary),
				);

			const rareRow = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('mystical')
						.setLabel('Mystical')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('chroma')
						.setLabel('Chroma')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('legendary')
						.setLabel('Legendary')
						.setStyle(ButtonStyle.Secondary),
				);

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('epic')
						.setLabel('Epic')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('rare')
						.setLabel('Rare')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('uncommon')
						.setLabel('Uncommon')
						.setStyle(ButtonStyle.Secondary),
				);

			const mainMenuEmbed = await new EmbedBuilder()
				.setColor('#0099ff')
				.setTitle(`${username}'s Inventory`)
				.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
				.setDescription(`**▸ 🎨 Collection total:** ${AllIntersection.length}/${Object.keys(AllBlooks).length} (${Math.round((AllIntersection.length / Object.keys(AllBlooks).length) * 100)}%)

				**▸ <:b_token:998636743941173288>** Sell Value: ${sellValue}
				
				**▸ 🟣 Mystical:** ${MysticalIntersection.length}/${MysticalBlooks.length} (${Math.round((MysticalIntersection.length / MysticalBlooks.length) * 100)}%)
				
				**▸ 🔵 Chroma:** ${ChromaIntersection.length}/${ChromaBlooks.length} (${Math.round((ChromaIntersection.length / ChromaBlooks.length) * 100)}%)
				
				**▸ 🟠 Legendary:** ${LegendaryIntersection.length}/${LegendaryBlooks.length} (${Math.round((LegendaryIntersection.length / LegendaryBlooks.length) * 100)}%)
				
				**▸ 🔴 Epic:** ${EpicIntersection.length}/${EpicBlooks.length} (${Math.round((EpicIntersection.length / EpicBlooks.length) * 100)}%)
				
				**▸ 🔵 Rare:** ${RareIntersection.length}/${RareBlooks.length} (${Math.round((RareIntersection.length / RareBlooks.length) * 100)}%)
				
				**▸ 🟢 Uncommon:** ${UncommonIntersection.length}/${UncommonBlooks.length} (${Math.round((UncommonIntersection.length / UncommonBlooks.length) * 100)}%)`);

			const blookEmbed = await new EmbedBuilder()
				.setTitle('All Blooks');

			if (MysticalIntersection.length > 0) {
				let MysticalBlooksList = '';
				for (let i = 0; i < MysticalIntersection.length; i++) {
					const blookName = MysticalIntersection[i];
					MysticalBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🟣 Mystical', value: `${MysticalBlooksList}`, inline: true });
			}

			if (ChromaIntersection.length > 0) {
				let ChromaBlooksList = '';
				for (let i = 0; i < ChromaIntersection.length; i++) {
					const blookName = ChromaIntersection[i];
					ChromaBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🔵 Chroma', value: `${ChromaBlooksList}`, inline: true });
			}

			if (LegendaryIntersection.length > 0) {
				let LegendaryBlooksList = '';
				for (let i = 0; i < LegendaryIntersection.length; i++) {
					const blookName = LegendaryIntersection[i];
					LegendaryBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🟠 Legendary', value: `${LegendaryBlooksList}`, inline: true });
			}

			if (EpicIntersection.length > 0) {
				let EpicBlooksList = '';
				for (let i = 0; i < EpicIntersection.length; i++) {
					const blookName = EpicIntersection[i];
					EpicBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🔴 Epic', value: `${EpicBlooksList}`, inline: true});
			}

			if (RareIntersection.length > 0) {
				let RareBlooksList = '';
				for (let i = 0; i < RareIntersection.length; i++) {
					const blookName = RareIntersection[i];
					RareBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🔵 Rare', value: `${RareBlooksList}`, inline: true });
			}

			if (UncommonIntersection.length > 0) {
				let UncommonBlooksList = '';
				for (let i = 0; i < UncommonIntersection.length; i++) {
					const blookName = UncommonIntersection[i];
					UncommonBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addFields({ name: '🟢 Uncommon', value: `${UncommonBlooksList}`, inline: true });
			}

			await interaction.editReply({ content: null, embeds: [ mainMenuEmbed ], components: [ navRow, rareRow, row ] });

			const filter = i => i.user.id === interaction.user.id;

			const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 600000 });

			collector.on('collect', async i => {
				if (i.customId === 'overview') return await i.update({ content: null, embeds: [ mainMenuEmbed ], components: [ navRow, rareRow, row ] });
				if (i.customId === 'blooks') return await i.update({ content: null, embeds: [ blookEmbed ], components: [ navRow, rareRow, row ] });

				const RarityBlooks = await BlookHelper.getBlooksByRarity(i.component.label);

				const rarityEmbed = await new EmbedBuilder()
					.setTitle(i.component.label);

				const allBoxes = await BlookHelper.getAllBoxes();

				for (const box in allBoxes) {
					const boxBlooks = RarityBlooks.filter(blook => allBoxes[box].blooks.includes(blook));
					if (boxBlooks.length > 0) {
						let BlooksList = '';
						for (let j = 0; j < boxBlooks.length; j++) {
							const blookName = boxBlooks[j];
							BlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
						}
						rarityEmbed.addFields({ name: allBoxes[box].boxName, value: BlooksList, inline: true });
					}
				}

				if (rarityEmbed.fields.length === 0) rarityEmbed.setDescription('No Blooks');

				await i.update({ content: null, embeds: [ rarityEmbed ], components: [ navRow, rareRow, row ] });
			});
		}
		catch (err) {
			console.log(err);
			const accountDoesntExistEmbed = await embedCreator(undefined, 'Can\'t find account!', undefined, undefined, `Couldn't find an account with the username \`\`${username}\`\`, are you sure you've typed the username correct?\n\n*Note: Usernames are case sensitive.*`, undefined, undefined, undefined, undefined, undefined);
			await interaction.editReply({ content: null, embeds: [ accountDoesntExistEmbed ], components: [ ] });
		}
	},
};