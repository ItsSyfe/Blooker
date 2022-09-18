const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, AttachmentBuilder, SelectMenuBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper');
const Canvas = require('canvas');
const BlooketAccountHelper = require('../util/BlooketAccountHelper');
const Logger = require('../util/Logger');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blooks')
		.setDescription('View a user\'s blooket blooks!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username of the user you want to view the blooks of.')),
	async execute(interaction) {
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

		const UserBlooks = await BlooketAccountHelper.fetchBlooksByUsername(username);

		if (Object.keys(UserBlooks).length === 0) {
			const noBlooksEmbed = new EmbedBuilder()
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setColor(`#990000`)
				.setTitle(`No blooks found!`)
				.setDescription(`Couldn't find any blooks for the user \`${username}\`!`);
			return await interaction.editReply({ content: null, embeds: [ noBlooksEmbed ], components: [ ] });
		}

		const UserBlooksNames = Object.keys(UserBlooks).sort();

		const Image = Canvas.Image;
		const canvas = Canvas.createCanvas(Math.ceil(UserBlooksNames.length / 24) > 1 ? 930 : UserBlooksNames.length * 47.5, Math.ceil(UserBlooksNames.length / 24) * 53.125);
		const ctx = canvas.getContext('2d');
		let x = 0;
		let y = 0;
		let completeCounter = 0

		for (let i = 0; i < UserBlooksNames.length; i++) {
			const blookInfo = await BlookHelper.getBlookByName(UserBlooksNames[i] !== "Rainbow Astronaut" ? UserBlooksNames[i] : "Red Astronaut");
			const img = new Image();
			img.onload = async () => {
				await ctx.drawImage(img, x, y, 37.5, 43.125)

				//console.log(`Finished drawing ${UserBlooksNames[i]} at ${x}, ${y}`);

				x += 47.5;
				if (x >= 930) {
					x = 0;
					y += 43.125;
				}

				completeCounter++;
			}
			img.onerror = err => { console.log(`${blookInfo.box} | ${blookInfo.id}`) }
			img.src = `https://blooket.s3.us-east-2.amazonaws.com/blooks/${blookInfo.box}/${blookInfo.id == 'ufo' ? 'UFO' : blookInfo.id}.svg`;
		}

		const AllMystical = await BlookHelper.getAllBlookNamesWithRarity('Mystical');
		const MysticalBlooks = UserBlooksNames.filter(value => AllMystical.includes(value));
		const AllChroma = await BlookHelper.getAllBlookNamesWithRarity('Chroma');
		const ChromaBlooks = UserBlooksNames.filter(value => AllChroma.includes(value));
		const AllLegendary = await BlookHelper.getAllBlookNamesWithRarity('Legendary');
		const LegendaryBlooks = UserBlooksNames.filter(value => AllLegendary.includes(value));
		const AllEpic = await BlookHelper.getAllBlookNamesWithRarity('Epic');
		const EpicBlooks = UserBlooksNames.filter(value => AllEpic.includes(value));
		const AllRare = await BlookHelper.getAllBlookNamesWithRarity('Rare');
		const RareBlooks = UserBlooksNames.filter(value => AllRare.includes(value));
		const AllUncommon = await BlookHelper.getAllBlookNamesWithRarity('Uncommon');
		const UncommonBlooks = UserBlooksNames.filter(value => AllUncommon.includes(value));

		const overviewEmbed = new EmbedBuilder()
			.setColor('#0cc3ce')
			.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
			.setTitle(`${username}'s Inventory`)
			.setURL(`https://dashboard.blooket.com/stats?name=${username}`)
			.setImage(`attachment://blooks.png`)
			.addFields(
				{ name: `▸ Collection`, value: `${UserBlooksNames.length}/${await BlookHelper.obtainableBlookCount()} \`\`(${Math.round((UserBlooksNames.length / await BlookHelper.obtainableBlookCount() * 100) * 100) / 100}%)\`\``, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: `▸ Sell Value`, value: `<:newblookettoken:1013531507069042748> ${(await Promise.all(UserBlooksNames.map(async blook => (await BlookHelper.getBlookInfo(blook)).sellValue == -1 ? 0 : (await BlookHelper.getBlookInfo(blook)).sellValue * UserBlooks[blook]))).reduce((partialSum, a) => partialSum + a, 0)}`, inline: true },
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

		let blooksOverviewAttachment;

		let timer = setInterval(async function () {
			if (completeCounter == UserBlooksNames.length) {
				clearInterval(timer)
				blooksOverviewAttachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: 'blooks.png' });
				await interaction.editReply({ embeds: [ overviewEmbed ], files: [ blooksOverviewAttachment ], components: [ navRow, selectRow ] });
			}
		}, 400);

		interaction.fetchReply()
			.then(async message => {
				const filter = i => i.user.id === interaction.user.id;

				const collector = message.createMessageComponentCollector({ filter,  time: 120000 });

				collector.on('collect', async (button) => {
					if (button.customId && button.customId === 'overview') {
						await button.update({ embeds: [ overviewEmbed ], files: [ blooksOverviewAttachment ], components: [ navRow, selectRow ] });
					}
					else {
						const raritySelected = button.values[0];
						const BlooksRarity = await BlookHelper.getAllBlookNamesWithRarity(raritySelected);
						const BlooksWithRarity = UserBlooksNames.filter(blook => BlooksRarity.includes(blook));

						if (BlooksWithRarity.length == 0) {
							await button.update({ embeds: [ new EmbedBuilder().setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) }).setTitle(`No ${raritySelected} blooks!`).setColor(`#990000`).setDescription(`${username} does not have any ${raritySelected} blooks.`) ], components: [ navRow, selectRow ], files: [ ] });
						}
						else {
							const rarityCanvas = Canvas.createCanvas(Math.ceil(BlooksWithRarity.length / 24) > 1 ? 930 : BlooksWithRarity.length * 47.5, Math.ceil(BlooksWithRarity.length / 24) * 53.125);
							const rarityctx = rarityCanvas.getContext('2d');
							let x = 0;
							let y = 0;
							let completeCounter = 0

							for (let i = 0; i < BlooksWithRarity.length; i++) {
								const blookInfo = await BlookHelper.getBlookByName(BlooksWithRarity[i] != "Rainbow Astronaut" ? BlooksWithRarity[i] : "Red Astronaut");
								const img = new Image();
								img.onload = async () => {
									await rarityctx.drawImage(img, x, y, 37.5, 43.125)

									x += 47.5;
									if (x >= 930) {
										x = 0;
										y += 43.125;
									}

									completeCounter++;
								}
								img.onerror = err => { console.log(`${blookInfo.box} | ${blookInfo.id}`) }
								img.src = `https://blooket.s3.us-east-2.amazonaws.com/blooks/${blookInfo.box}/${blookInfo.id == 'ufo' ? 'UFO' : blookInfo.id}.svg`;
							}

							const rarityEmbed = new EmbedBuilder()
								.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
								.setTitle(`${raritySelected} Blooks`)
								.setColor(raritySelected == 'Mystical' ? '#ff00ff' : raritySelected == 'Chroma' ? '#00ffff' : raritySelected == 'Legendary' ? '#ff0000' : raritySelected == 'Epic' ? '#ff0000' : raritySelected == 'Rare' ? '#0000ff' : raritySelected == 'Uncommon' ? '#00ff00' : '#ffffff')
								.setDescription(BlooksWithRarity.map(blook => `▸ ${blook} \`${UserBlooks[blook]}x\``).join('\n'))
								.setImage(`attachment://rarityblooks.png`)

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
					try {
						const attachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: 'blooks.png' });
						await interaction.editReply({ embeds: [ overviewEmbed ], files: [ attachment ], components: [ ] });
					} catch (e) {
						Logger.debug("Embed not found")
					}
				})
			})
	},
};