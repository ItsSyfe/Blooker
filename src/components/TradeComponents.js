const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

// ------------------------------
// main menu
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
			.setLabel('Preview and Submit')
			.setStyle(ButtonStyle.Danger),
	);

exports.tradeMenuEmbed = new EmbedBuilder()
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu')
	.setDescription('Use the buttons below to create a trade offer to put onto the market.\n\n*Note: You can only have a maximum of 10 trade offers at a time.*');

exports.tradeMainMenuRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_menu')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
	);

exports.tradePreviewRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_menu')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId('trade_submit')
			.setLabel('Submit')
			.setStyle(ButtonStyle.Danger),
	);
// ------------------------------
// trade offer
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
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu')
	.setDescription('Select what you\'d like to do to your offer.\n\n*Note: You can "buy" blooks by just requesting for a trade of tokens for a specific blook.*');

exports.tradeAddModifyEmbedNoItems = new EmbedBuilder()
	.setColor('#990000')
	.setTitle('Trade Offer Creation Menu')
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
	.setColor('#990000')
	.setTitle('Trade Offer Creation Menu')
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
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu')
	.setDescription(`Use the buttons below to add blooks to your offer.\n\n*If you'd like to recieve any from one of the rarities simply select the first option in the rarity menu.*`);

exports.tradeAddBlookEmbedSuccess = new EmbedBuilder()
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu');

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
// ------------------------------
// trade request
exports.tradeRequestRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_menu')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId('trade_request_blook')
			.setLabel('Add Blooks to Offer')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request_token')
			.setLabel('Set Token Offer')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('trade_request_modify')
			.setLabel('Modify Offer')
			.setStyle(ButtonStyle.Danger),
	);

exports.tradeRequestEmbed = new EmbedBuilder()
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu')
	.setDescription('Select what you\'d like to do to your request.\n\n*Note: You can "sell" blooks by just offering a trade of tokens for a specific blook.*');

exports.tradeRequestModifyEmbedNoItems = new EmbedBuilder()
	.setColor('#990000')
	.setTitle('Trade Offer Creation Menu')
	.setDescription('No items in request to modify, add items to your request first.');

exports.tradeRequestTokenModal = new ModalBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setCustomId('trade_request_token_modal')
	.addComponents(
		new ActionRowBuilder()
			.addComponents(
				new TextInputBuilder()
					.setCustomId('trade_request_token_input')
					.setLabel('Token Amount')
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Enter a number.')
					.setRequired(true)
					.setMaxLength(12)
					.setMinLength(1),
			),
	);

exports.tradeRequestTokenModalEmbedFailed = new EmbedBuilder()
	.setColor('#990000')
	.setTitle('Trade Offer Creation Menu')
	.setDescription('Please enter a valid number of tokens to request for in your request.');

exports.tradeRequestBlookRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_request_blook_mystical')
			.setLabel('Mystical')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request_blook_chroma')
			.setLabel('Chroma')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request_blook_legendary')
			.setLabel('Legendary')
			.setStyle(ButtonStyle.Primary),
	);

exports.tradeRequestBlookRowExtra = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_request_blook_epic')
			.setLabel('Epic')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request_blook_rare')
			.setLabel('Rare')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_request_blook_uncommon')
			.setLabel('Uncommon')
			.setStyle(ButtonStyle.Primary),
	);

exports.tradeRequestBlookEmbed = new EmbedBuilder()
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu')
	.setDescription(`Use the buttons below to request blooks to add to your request.\n\n*If you'd like to recieve any from one of the rarities simply select the first option in the rarity menu.*`);

exports.tradeRequestBlookEmbedSuccess = new EmbedBuilder()
	.setColor('#0cc3ce')
	.setTitle('Trade Offer Creation Menu');

exports.tradeRequestBlookMenuRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_request_blook')
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary),
	);

exports.tradeRequestBlookMenuPageNavRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('trade_request_blook_collector')
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
// ------------------------------