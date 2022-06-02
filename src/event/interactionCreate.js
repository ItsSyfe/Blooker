const { CommandInteraction, ButtonInteraction, ModalInteraction } = require('../util/InteractionEventHelper');
const { debug } = require('../util/Logger.js');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		debug(`Interaction created: ${interaction.id} - ${interaction.type}`);

		if (interaction.isCommand()) await CommandInteraction(client, interaction);
		else if (interaction.isButton()) await ButtonInteraction(client, interaction);
		else if (interaction.isModalSubmit()) await ModalInteraction(client, interaction);
	},
};