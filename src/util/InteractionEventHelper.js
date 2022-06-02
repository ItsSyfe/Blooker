const { info, debug, error } = require('../util/Logger.js');

exports.CommandInteraction = async (client, interaction) => {
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		info(`Executing command: ${command.data.name}`);
		await command.execute(interaction);
	}
	catch (e) {
		error(`Error executing command: ${command.data.name}`);
		debug(e);
		await interaction.reply('There was an error trying to execute that command.');
	}
};

exports.ButtonInteraction = async (client, interaction) => {
	const executor = interaction.user;
	debug(`${executor.tag} clicked button: ${interaction.customId}`);
	const button = client.buttons.get(interaction.customId);


	if (!button) return;

	try {
		info(`Executing button: ${button.data.customId}`);
		await button.execute(interaction);
	}
	catch (e) {
		error(`Error executing button: ${button.data.customId}`);
		debug(e);
	}
};

exports.ModalInteraction = async (client, interaction) => {
	const executor = interaction.user;
	debug(`Modal ${interaction.customId} submitted by ${executor.tag}`);
	const modal = client.modals.get(interaction.customId);

	if (!modal) return;

	try {
		info(`Executing modal: ${modal.data.customId}`);
		await modal.execute(interaction);
	}
	catch (e) {
		error(`Error executing modal: ${modal.data.customId}`);
		debug(e);
	}
};