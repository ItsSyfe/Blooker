const { CommandInteraction, ButtonInteraction, ModalInteraction, SelectMenuInteraction } = require('../util/InteractionEventHelper');
const Logger = require('../util/Logger.js');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		Logger.debug(`Interaction created: ${interaction.id} - ${interaction.type}`);

		if (interaction.isCommand()) await CommandInteraction(client, interaction);
		else if (interaction.isButton()) await ButtonInteraction(client, interaction);
		else if (interaction.isModalSubmit()) await ModalInteraction(client, interaction);
		else if (interaction.isSelectMenu()) await SelectMenuInteraction(client, interaction);
	},
};