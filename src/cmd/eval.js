const { SlashCommandBuilder } = require('discord.js');

const clean = async (text) => {
	if (text && text.constructor.name == "Promise")
	  text = await text;
	
	if (typeof text !== "string")
	  text = require("util").inspect(text, { depth: 1 });
	
	text = text
	  .replace(/`/g, "`" + String.fromCharCode(8203))
	  .replace(/@/g, "@" + String.fromCharCode(8203));
	
	return text;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('DEV ONLY: Execute Arbitrary JavaScript')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('JavaScript code')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Run the code asynchronously')
				.setRequired(false)),
	async execute(interaction) {
		if (interaction.user.id !== '190733468550823945') {
			return await interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: interaction.options.getBoolean('ephemeral') });

		try {
			const evaled = eval(interaction.options.getString('code'));

			const cleanEvaled = await clean(evaled);

			await interaction.editReply({ content: `\`\`\`js\n${cleanEvaled}\n\`\`\``, ephemeral: interaction.options.getBoolean('ephemeral') });
		} catch (err) {
			await interaction.editReply({ content: `\`ERROR\` \`\`\`xl\n${err}\n\`\`\``, ephemeral: interaction.options.getBoolean('ephemeral') });
		}
	},
};