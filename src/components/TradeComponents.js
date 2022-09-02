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
			.setLabel('Add Blooks')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId('trade_add_token')
			.setLabel('Add Tokens')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('trade_add_modify')
			.setLabel('Modify')
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

exports.tradeAddModifyEmbed = new EmbedBuilder()
	.setTitle('Trade Offer Creation Menu')
	.setColor('#990000')
	.setDescription('Use the select menu below to remove items from your offer.');

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