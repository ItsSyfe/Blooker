const Logger = require('./Logger');

exports.CommandInteraction = async (client, interaction) => {
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		Logger.info(`Executing command: ${command.data.name}`);
		await command.execute(interaction);
	}
	catch (e) {
		Logger.error(`Error executing command: ${command.data.name}`);
		console.log(e);
		await interaction.followUp('There was an error trying to execute that command.');
	}
};

exports.ButtonInteraction = async (client, interaction) => {
	const executor = interaction.user;
	Logger.debug(`${executor.tag} clicked button: ${interaction.customId}`);

	if (executor.id !== interaction.message.interaction.user.id) return interaction.reply({ content: 'You can\'t use this button.', ephemeral: true });

	const button = client.buttons.get(interaction.customId);

	if (!button) return;

	try {
		Logger.info(`Executing button: ${button.data.customId}`);
		await button.execute(interaction);
	}
	catch (e) {
		Logger.error(`Error executing button: ${button.data.customId}`);
		console.log(e);
	}
};

exports.ModalInteraction = async (client, interaction) => {
	const executor = interaction.user;
	Logger.debug(`Modal ${interaction.customId} submitted by ${executor.tag}`);
	const modal = client.modals.get(interaction.customId);

	if (!modal) return;

	try {
		Logger.info(`Executing modal: ${modal.data.customId}`);
		await modal.execute(interaction);
	}
	catch (e) {
		Logger.error(`Error executing modal: ${modal.data.customId}`);
		console.log(e);
	}
};

exports.SelectMenuInteraction = async (client, interaction) => {
	const executor = interaction.user;
	Logger.debug(`${executor.tag} used select menu: ${interaction.customId}`);
	const selectMenu = client.selectMenus.get(interaction.customId);

	if (!selectMenu) return;

	try {
		Logger.info(`Executing select menu: ${selectMenu.data.customId}`);
		await selectMenu.execute(interaction);
	}
	catch (e) {
		Logger.error(`Error executing select menu: ${selectMenu.data.customId}`);
		console.log(e);
	}
};