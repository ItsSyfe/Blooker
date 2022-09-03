const TradeComponents = require('../components/TradeComponents.js');
const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const BlookHelper = require('../util/BlookHelper.js');

module.exports = {
	data: {
		customId: 'trade_add_blook_epic',
	},
	async execute(interaction) {
		const epicBlooks = await BlookHelper.getBlooksByRarity('Epic');

		const rarityEmbeds = [];
		const selectMenus = [];
		let pagenumber = 0;

		for (let i = 0; i < Math.ceil(epicBlooks.length / 10); i++) {
			const blooks = epicBlooks.slice(i * 10, (i + 1) * 10);
			const tradeAddRarityEmbed = new EmbedBuilder()
				.setTitle('Epic')
				.setColor('#990000')
				.setDescription(`Select a blook you'd like to add to your offer.\n\n*If you'd like to recieve any from one of the rarities simply select the first option.*`)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
				.setFooter({ text: `Page ${i + 1}/${Math.ceil(epicBlooks.length / 10)}` });

			const selectMenu = new SelectMenuBuilder()
				.setCustomId('trade_add_blook_select')
				.setPlaceholder('Select a blook to add to your offer.');

			if(i === 0) {
				selectMenu.addOptions({ label: `Any Epic Blook`, value: `epic` });
			}

			for (let j = 0; j < blooks.length; j++) {
				const blook = await BlookHelper.getBlook(blooks[j]);
				selectMenu.addOptions({ label: `${blooks[j]}`, value: `${blooks[j].replace(/\s/g, "").toLowerCase()}` });
				tradeAddRarityEmbed.addFields({ name: `${blooks[j]}`, value: `<:newblookettoken:1013531507069042748> ${blook.sellValue}`, inline: true });
			}

			const selectMenuRow = new ActionRowBuilder()
				.addComponents(
					selectMenu
				);

			rarityEmbeds.push(tradeAddRarityEmbed);
			selectMenus.push(selectMenuRow);
		}

		await interaction.update({ content: null, embeds: [rarityEmbeds[pagenumber]], components: [TradeComponents.tradeAddBlookMenuPageNavRow, selectMenus[pagenumber]] });

		const filter = i => i.user.id === interaction.user.id;

		const collector = interaction.message.createMessageComponentCollector({ filter,  time: 300000 });

		collector.on('collect', async i => {
			if (!(i.customId === "left" || i.customId === "right" || i.customId === "trade_add_blook_collector")) return;

			if (i.customId === "trade_add_blook_collector") {
				collector.stop();
				const tradeAddBlookEmbed = TradeComponents.tradeAddBlookEmbed;
				tradeAddBlookEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

				return await interaction.update({ content: null, embeds: [tradeAddBlookEmbed], components: [TradeComponents.tradeMainMenuRow, TradeComponents.tradeAddBlookRow, TradeComponents.tradeAddBlookRowExtra] });
			}

			else if (i.customId === "left") {
				if (pagenumber == 0) pagenumber = rarityEmbeds.length - 1;
				else pagenumber--;
			}
		
			else if (i.customId === "right") {
				if (pagenumber == rarityEmbeds.length - 1) pagenumber = 0;
				else pagenumber++;
			}

			i.update({ content: null, embeds: [rarityEmbeds[pagenumber]], components: [TradeComponents.tradeAddBlookMenuPageNavRow, selectMenus[pagenumber]] })
		})
	},
};