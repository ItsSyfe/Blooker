const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { info, debug } = require('./util/Logger.js');

client.commands = new Collection();
const cmdFiles = fs.readdirSync('./src/cmd/').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const cmd = require(`./cmd/${file}`);
	info(`Loading command: ${cmd.data.name}`);
	client.commands.set(cmd.data.name, cmd);
	debug(`Loaded command: ${cmd.data.name}`);
}

client.buttons = new Collection();
const buttonFiles = fs.readdirSync('./src/button/').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const button = require(`./button/${file}`);
	info(`Loading button: ${button.data.customId}`);
	client.buttons.set(button.data.customId, button);
	debug(`Loaded button: ${button.data.customId}`);
}

const eventFiles = fs.readdirSync('./src/event/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./event/${file}`);
	info(`Loading event: ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
		debug(`Loaded event: ${event.name}`);
	}
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
		debug(`Loaded event: ${event.name}`);
	}
}

client.login(process.env.TOKEN);