const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
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
				sellValue += blookData.sellValue > 0 ? blookData.sellValue : 0;
			}

			const navRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('overview')
						.setLabel('Overview')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('blooks')
						.setLabel('All Blooks')
						.setStyle('PRIMARY'),
				);

			const rareRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('mystical')
						.setLabel('Mystical')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('chroma')
						.setLabel('Chroma')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('legendary')
						.setLabel('Legendary')
						.setStyle('SECONDARY'),
				);

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('epic')
						.setLabel('Epic')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('rare')
						.setLabel('Rare')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('uncommon')
						.setLabel('Uncommon')
						.setStyle('SECONDARY'),
				);

			const mainMenuEmbed = await new MessageEmbed()
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

			const blookEmbed = await new MessageEmbed()
				.setTitle('All Blooks');

			if (MysticalIntersection.length > 0) {
				let MysticalBlooksList = '';
				for (let i = 0; i < MysticalIntersection.length; i++) {
					const blookName = MysticalIntersection[i];
					MysticalBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🟣 Mystical', `${MysticalBlooksList}`, true);
			}

			if (ChromaIntersection.length > 0) {
				let ChromaBlooksList = '';
				for (let i = 0; i < ChromaIntersection.length; i++) {
					const blookName = ChromaIntersection[i];
					ChromaBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🔵 Chroma', `${ChromaBlooksList}`, true);
			}

			if (LegendaryIntersection.length > 0) {
				let LegendaryBlooksList = '';
				for (let i = 0; i < LegendaryIntersection.length; i++) {
					const blookName = LegendaryIntersection[i];
					LegendaryBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🟠 Legendary', `${LegendaryBlooksList}`, true);
			}

			if (EpicIntersection.length > 0) {
				let EpicBlooksList = '';
				for (let i = 0; i < EpicIntersection.length; i++) {
					const blookName = EpicIntersection[i];
					EpicBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🔴 Epic', `${EpicBlooksList}`, true);
			}

			if (RareIntersection.length > 0) {
				let RareBlooksList = '';
				for (let i = 0; i < RareIntersection.length; i++) {
					const blookName = RareIntersection[i];
					RareBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🔵 Rare', `${RareBlooksList}`, true);
			}

			if (UncommonIntersection.length > 0) {
				let UncommonBlooksList = '';
				for (let i = 0; i < UncommonIntersection.length; i++) {
					const blookName = UncommonIntersection[i];
					UncommonBlooksList += `**▸** ${blookName}${unlocks[blookName] > 1 ? ` (\`\`${unlocks[blookName]}x\`\`)` : ''}\n`;
				}
				blookEmbed.addField('🟢 Uncommon', `${UncommonBlooksList}`, true);
			}

			await interaction.editReply({ content: null, embeds: [ mainMenuEmbed ], components: [ navRow, rareRow, row ] });

			const filter = i => i.user.id === interaction.user.id;

			const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 600000 });

			collector.on('collect', async i => {
				if (i.customId === 'overview') return await i.update({ content: null, embeds: [ mainMenuEmbed ], components: [ navRow, rareRow, row ] });
				if (i.customId === 'blooks') return await i.update({ content: null, embeds: [ blookEmbed ], components: [ navRow, rareRow, row ] });

				const RarityBlooks = await BlookHelper.getBlooksByRarity(i.component.label);

				const rarityEmbed = await new MessageEmbed()
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
						rarityEmbed.addField(allBoxes[box].boxName, BlooksList, true);
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