const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, AttachmentBuilder, SelectMenuBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper');
const Canvas = require('canvas');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('missingblooks')
		.setDescription('View a user\'s missing blooket blooks!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the missing blooks of.')),
	async execute(interaction) {
		// TODO: Remake this
		if (!interaction.inGuild()) {
			const guildOnlyEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`Only available in a server!`)
				.setDescription(`Please make sure to use this command in a discord server! You can join our discord [here](https://discord.gg/8M7CKGWvS2)!`);
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

		if (!await BlooketAccountHelper.doesUserExist(username)) {
			const userNotFoundEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`User not found!`)
				.setDescription(`Couldn't find a user with the name \`${username}\`!`);
			return await interaction.editReply({ content: null, embeds: [ userNotFoundEmbed ], components: [ ] });
		}

		const tempUserBlooks = Object.keys(await BlooketAccountHelper.fetchBlooksByUsername(username));
		const UserBlooks = (await BlookHelper.getAllObtainableBlookNames()).filter(x => !tempUserBlooks.includes(x));

		const Image = Canvas.Image;
		const canvas = Canvas.createCanvas(Math.ceil(UserBlooks.length / 24) > 1 ? 1140 : UserBlooks.length * 47.5, Math.ceil(UserBlooks.length / 24) * 48.125);
		const ctx = canvas.getContext('2d');
		let completeCounter = 0

		for (let i = 0; i < UserBlooks.length; i++) {
			const blookInfo = await BlookHelper.getBlookByName(UserBlooks[i] !== "Rainbow Astronaut" ? UserBlooks[i] : "Red Astronaut");
			const img = new Image();
			img.onload = async () => {
				await ctx.drawImage(img, (i - (Math.trunc(i/24) * 24)) * 47.5, (Math.trunc(i/24)) * 43.125, 37.5, 43.125)

				//console.log(`Finished drawing ${UserBlooks[i]} at ${x}, ${y}`);

				completeCounter++;
			}
			img.onerror = err => { console.log(err); console.log(`${blookInfo.box} | ${blookInfo.id}`) }
			img.src = `https://undercovergoose.github.io/blooket-src/blooks/${blookInfo.box}/${blookInfo.id == 'ufo' ? 'UFO' : blookInfo.id}.png`;
		}

		const AllMystical = await BlookHelper.getAllBlookNamesWithRarity('Mystical');
		const MysticalBlooks = AllMystical.filter(value => UserBlooks.includes(value));
		const AllChroma = await BlookHelper.getAllBlookNamesWithRarity('Chroma');
		const ChromaBlooks = AllChroma.filter(value => UserBlooks.includes(value));
		const AllLegendary = await BlookHelper.getAllBlookNamesWithRarity('Legendary');
		const LegendaryBlooks = AllLegendary.filter(value => UserBlooks.includes(value));
		const AllEpic = await BlookHelper.getAllBlookNamesWithRarity('Epic');
		const EpicBlooks = AllEpic.filter(value => UserBlooks.includes(value));
		const AllRare = await BlookHelper.getAllBlookNamesWithRarity('Rare');
		const RareBlooks = AllRare.filter(value => UserBlooks.includes(value));
		const AllUncommon = await BlookHelper.getAllBlookNamesWithRarity('Uncommon');
		const UncommonBlooks = AllUncommon.filter(value => UserBlooks.includes(value));

		const overviewEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle(`${username}'s Missing Inventory`)
			.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
			.setImage(`attachment://blooks.png`)
			.addFields(
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `▸ Collection Missing`, value: `${UserBlooks.length}/${await BlookHelper.obtainableBlookCount()} \`\`(${Math.round((UserBlooks.length / await BlookHelper.obtainableBlookCount() * 100) * 100) / 100}%)\`\``, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `🟣 Mystical`, value: `${MysticalBlooks.length}/${AllMystical.length} \`\`(${Math.round((MysticalBlooks.length / AllMystical.length * 100) * 100) / 100}%)\`\``, inline: true},
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `🔷 Chroma`, value: `${ChromaBlooks.length}/${AllChroma.length} \`\`(${Math.round((ChromaBlooks.length / AllChroma.length * 100) * 100) / 100}%)\`\``, inline: true},
				{ name: `🟠 Legendary`, value: `${LegendaryBlooks.length}/${AllLegendary.length} \`\`(${Math.round((LegendaryBlooks.length / AllLegendary.length * 100) * 100) / 100}%)\`\``, inline: true},
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `🔴 Epic`, value: `${EpicBlooks.length}/${AllEpic.length} \`\`(${Math.round((EpicBlooks.length / AllEpic.length * 100) * 100) / 100}%)\`\``, inline: true},
				{ name: `🔵 Rare`, value: `${RareBlooks.length}/${AllRare.length} \`\`(${Math.round((RareBlooks.length / AllRare.length * 100) * 100) / 100}%)\`\``, inline: true},
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `🟢 Uncommon`, value: `${UncommonBlooks.length}/${AllUncommon.length} \`\`(${Math.round((UncommonBlooks.length / AllUncommon.length * 100) * 100) / 100}%)\`\``, inline: true},
			);

		const navRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('overview')
					.setLabel('Overview')
					.setStyle(ButtonStyle.Primary),
			);

		const selectRow = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('rarityselect')
					.setPlaceholder('Select a rarity')
					.addOptions(
						{ label: 'Mystical', value: 'Mystical' },
						{ label: 'Chroma', value: 'Chroma' },
						{ label: 'Legendary', value: 'Legendary' },
						{ label: 'Epic', value: 'Epic' },
						{ label: 'Rare', value: 'Rare' },
						{ label: 'Uncommon', value: 'Uncommon' },
				)
			);

		let timer = setInterval(async function () {
			if (completeCounter == UserBlooks.length) {
				clearInterval(timer)
				const blooksOverviewAttachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: 'blooks.png' });
				await interaction.editReply({ embeds: [ overviewEmbed ], files: [ blooksOverviewAttachment ], components: [ navRow, selectRow ] });
			}
		}, 400);

		interaction.fetchReply()
			.then(async message => {
				const filter = i => i.user.id === interaction.user.id;

				const collector = message.createMessageComponentCollector({ filter,  time: 120000 });

				collector.on('collect', async (button) => {
					if (button.customId && button.customId === 'overview') {
						const blooksOverviewAttachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: 'blooks.png' });
						await button.update({ embeds: [ overviewEmbed ], files: [ blooksOverviewAttachment ], components: [ navRow, selectRow ] });
					}
					else {
						const raritySelected = button.values[0];
						const BlooksRarity = await BlookHelper.getAllBlookNamesWithRarity(raritySelected);
						const BlooksWithRarity = BlooksRarity.filter(blook => UserBlooks.includes(blook));
						let BlooksByBox = { };
						const allBoxes = await BlookHelper.getAllBoxes();
						for(const box in allBoxes) {
							const boxInfo = allBoxes[box];
							const BlooksInBox = boxInfo.blooks.filter(blook => BlooksWithRarity.includes(blook));
							if (BlooksInBox.length > 0) BlooksByBox[boxInfo.boxName] = BlooksInBox;
						}
						BlooksByBox = Object.entries(BlooksByBox).sort((a, b) => b[1].length - a[1].length);

						if (BlooksWithRarity.length == 0) {
							await button.update({ embeds: [ new EmbedBuilder().setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) }).setTitle(`No ${raritySelected} blooks!`).setColor(`#990000`).setDescription(`${username} is not missing any ${raritySelected} blooks.`) ], components: [ navRow, selectRow ], files: [ ] });
						}
						else {
							const rarityCanvas = Canvas.createCanvas(Math.ceil(BlooksWithRarity.length / 24) > 1 ? 1140 : BlooksWithRarity.length * 47.5, Math.ceil(BlooksWithRarity.length / 24) * 58.125);
							const rarityctx = rarityCanvas.getContext('2d');
							let completeCounter = 0

							for (let i = 0; i < BlooksWithRarity.length; i++) {
								const blookInfo = await BlookHelper.getBlookByName(BlooksWithRarity[i] !== "Rainbow Astronaut" ? BlooksWithRarity[i] : "Red Astronaut");
								const img = new Image();
								img.onload = async () => {
									await rarityctx.drawImage(img, (i - (Math.trunc(i/24) * 24)) * 47.5, (Math.trunc(i/24)) * 43.125, 37.5, 43.125)

									completeCounter++;
								}
								img.onerror = err => { console.log(err);console.log(`${blookInfo.box} | ${blookInfo.id}`) }
								img.src = `https://undercovergoose.github.io/blooket-src/blooks/${blookInfo.box}/${blookInfo.id == 'ufo' ? 'UFO' : blookInfo.id}.png`;
							}

							const rarityEmbed = new EmbedBuilder()
								.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
								.setTitle(`${raritySelected} Blooks`)
								.setColor(raritySelected == 'Mystical' ? '#ff00ff' : raritySelected == 'Chroma' ? '#00ffff' : raritySelected == 'Legendary' ? '#ff0000' : raritySelected == 'Epic' ? '#ff0000' : raritySelected == 'Rare' ? '#0000ff' : raritySelected == 'Uncommon' ? '#00ff00' : '#ffffff')
								.setImage(`attachment://rarityblooks.png`)

							for(const [box, blooks] of BlooksByBox) {
								await rarityEmbed.addFields({ name: `${box} Blooks`, value: blooks.map(blook => `▸ ${blook}`).join('\n') });
							}

							let timer = setInterval(async function () {
								if (completeCounter == BlooksWithRarity.length) {
									clearInterval(timer)
									const attachment = new AttachmentBuilder(await rarityCanvas.createPNGStream(), { name: 'rarityblooks.png' });
									await button.update({ embeds: [ rarityEmbed ], files: [ attachment ], components: [ navRow, selectRow ] });
								}
							}, 400);
						}
					}
					await collector.resetTimer();
				})

				collector.on('end', async () => {
					const attachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: 'blooks.png' });
					await interaction.editReply({ embeds: [ overviewEmbed ], files: [ attachment ], components: [ ] });
				})
			})
	},
};