const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');

require('dotenv').config();

const commands = [];
const cmdFiles = fs.readdirSync('./src/cmd/').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const cmd = require(`./cmd/${file}`);
	commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

/*
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
*/

/*
rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
*/

rest.get(Routes.applicationGuildCommands(clientId, guildId))
	.then(data => {
		const promises = [];
		for (const command of data) {
			const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
			promises.push(rest.delete(deleteUrl));
		}
		return Promise.all(promises);
	});
