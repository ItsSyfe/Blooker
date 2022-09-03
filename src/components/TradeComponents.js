const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

exports.tradeMenuRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_add')
			.setLabel('Offer')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request')
			.setLabel('Request')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_preview')
			.setLabel('Preview')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('trade_submit')
			.setLabel('Submit')
			.setStyle(ButtonStyle.Danger),
	);

exports.tradeMenuEmbed = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription('Use the buttons below to create a trade offer to put onto the market.\n\n*Note: You can only have a maximum of 10 trade offers at a time.*');

exports.tradeAddRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_menu')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId('trade_add_blook')
			.setLabel('Add Blooks to Offer')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_token')
			.setLabel('Set Token Offer')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('trade_add_modify')
			.setLabel('Modify Offer')
			.setStyle(ButtonStyle.Danger),
	);

exports.tradeAddEmbed = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription('Select what you\'d like to do to your offer.\n\n*Note: You can "buy" blooks by just requesting for a trade of tokens for a specific blook.*');

exports.tradeMainMenuRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_menu')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
	);

exports.tradeAddModifyEmbedNoItems = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription('No items in offer to modify, add items to your offer first.');

exports.tradeAddTokenModal = new ModalBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setCustomId('trade_add_token_modal')
	.addComponents(
		new ActionRowBuilder()
			.addComponents(
				new TextInputBuilder()
					.setCustomId('trade_add_token_input')
					.setLabel('Token Amount')
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Enter a number.')
					.setRequired(true)
					.setMaxLength(12)
					.setMinLength(1),
			),
	);

exports.tradeAddTokenModalEmbedFailed = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription('Please enter a valid number of tokens to add to your offer.');

exports.tradeAddBlookRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_add_blook_mystical')
			.setLabel('Mystical')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_blook_chroma')
			.setLabel('Chroma')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_blook_legendary')
			.setLabel('Legendary')
			.setStyle(ButtonStyle.Primary),
	);

exports.tradeAddBlookRowExtra = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_add_blook_epic')
			.setLabel('Epic')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_blook_rare')
			.setLabel('Rare')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_blook_uncommon')
			.setLabel('Uncommon')
			.setStyle(ButtonStyle.Primary),
	);

exports.tradeAddBlookEmbed = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription(`Use the buttons below to add blooks to your offer.\n\n*If you'd like to recieve any from one of the rarities simply select the first option in the rarity menu.*`);

exports.tradeAddBlookEmbedSuccess = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000');

exports.tradeAddBlookMenuRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_add_blook')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
	);

exports.tradeAddBlookMenuPageNavRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_add_blook_collector')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("left")
			.setLabel("◀️")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("right")
			.setLabel("▶️")
			.setStyle(ButtonStyle.Primary),
	);