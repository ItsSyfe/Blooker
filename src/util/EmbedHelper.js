const { MessageEmbed } = require('discord.js');

/**
* Embed Creator made by Syfe (credit if you use it).
* A useful embed creator providing only required things, certain variables are hard-coded for the sake of simplicity, uses ternary operators to ignore incomplete values.
* @param {Channel} channel Discord.js Channel object
* @param {String} colour Hex code of embed. Default: None
* @param {String} title Title text. Default: Title
* @param {URL} url URL of title. Default: None
* @param {Array} author Author of embed, displayed at top. Default: None
* @param {String} description Description under title. Default: None
* @param {URL} thumbnail Thumbnail displayed to the right of embed at top. Default: None
* @param {Array} fields Array containing all fields of embed. Default: None
* @param {URL} image Image in embed, displayed at bottom of embed. Default: None
* @param {Date} timestamp Timestamp of embed. Default: Current Time
* @param {Array} footer Footer of embed. Default: Made with <3, Bot PFP
*/
exports.embedCreator = (colour, title, url, author, description, thumbnail, fields, image, timestamp, footer) => {
	const embed = new MessageEmbed()
		.setColor(colour ? colour : '#223AFF')
		.setTitle(title ? title : 'Title')
		.setURL(url ? url : undefined)
		.setThumbnail(thumbnail ? thumbnail : undefined)
		.setImage(image ? image : undefined)
		.setTimestamp(timestamp ? timestamp : new Date().getTime())
		.setFooter(footer ? footer : 'Made with BLOOKS');

	if (author) embed.setAuthor(author);
	if (description) embed.setDescription(description);

	if (fields !== undefined) embed.addFields(fields);

	return embed;
};