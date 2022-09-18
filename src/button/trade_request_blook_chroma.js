const TradeComponents = require('../components/TradeComponents.js');
const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper.js');

module.exports = {
	data: {
		customId: 'trade_request_blook_chroma',
	},
	async execute(interaction) {
		const chromaBlooks = await BlookHelper.getAllBlookNamesWithRarity('Chroma');

		const rarityEmbeds = [];
		const selectMenus = [];
		let pagenumber = 0;

		for (let i = 0; i < Math.ceil(chromaBlooks.length / 10); i++) {
			const blooks = chromaBlooks.slice(i * 10, (i + 1) * 10);
			const tradeRequestRarityEmbed = new EmbedBuilder()
				.setColor('#0cc3ce')
				.setFooter({ text: 'Blooker by Syfe', iconURL: await interaction.client.users.fetch('190733468550823945').then(user => user.displayAvatarURL({ dynamic: false })) })
				.setTitle('Chroma')
				.setDescription(`Select a blook you'd like to add to your request.\n\n*If you'd like to recieve any from one of the rarities simply select the first option.*\n\nPage ${i + 1}/${Math.ceil(chromaBlooks.length / 10)}`)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })

			const selectMenu = new SelectMenuBuilder()
				.setCustomId('trade_request_blook_select')
				.setPlaceholder('Select a blook to add to your request.');

			if(i === 0) {
				selectMenu.addOptions({ label: `Any Chroma Blook`, value: `chroma` });
			}

			for (let j = 0; j < blooks.length; j++) {
				const blook = await BlookHelper.getBlookInfo(blooks[j]);
				selectMenu.addOptions({ label: `${blooks[j]}`, value: `${blooks[j].replace(/\s/g, "").toLowerCase()}` });
				tradeRequestRarityEmbed.addFields({ name: `${blooks[j]}`, value: `<:newblookettoken:1013531507069042748> ${blook.sellValue}`, inline: true });
			}

			const selectMenuRow = new ActionRowBuilder()
				.addComponents(
					selectMenu
				);

			rarityEmbeds.push(tradeRequestRarityEmbed);
			selectMenus.push(selectMenuRow);
		}

		await interaction.update({ content: null, embeds: [rarityEmbeds[pagenumber]], components: [TradeComponents.tradeRequestBlookMenuPageNavRow, selectMenus[pagenumber]] });

		const filter = i => i.user.id === interaction.user.id;

		const collector = interaction.message.createMessageComponentCollector({ filter,  time: 300000 });

		collector.on('collect', async i => {
			if (!(i.customId === "left" || i.customId === "right" || i.customId === "trade_request_blook_collector")) return;

			if (i.customId === "trade_request_blook_collector") {
				collector.stop();
				const tradeRequestBlookEmbed = TradeComponents.tradeRequestBlookEmbed;
				tradeRequestBlookEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

				return await interaction.update({ content: null, embeds: [tradeRequestBlookEmbed], components: [TradeComponents.tradeMainMenuRow, TradeComponents.tradeRequestBlookRow, TradeComponents.tradeRequestBlookRowExtra] });
			}

			else if (i.customId === "left") {
				if (pagenumber == 0) pagenumber = rarityEmbeds.length - 1;
				else pagenumber--;
			}
		
			else if (i.customId === "right") {
				if (pagenumber == rarityEmbeds.length - 1) pagenumber = 0;
				else pagenumber++;
			}

			i.update({ content: null, embeds: [rarityEmbeds[pagenumber]], components: [TradeComponents.tradeRequestBlookMenuPageNavRow, selectMenus[pagenumber]] })
		})
	},
};