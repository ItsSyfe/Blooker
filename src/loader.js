const fs = require('fs');
const { info, debug, error } = require('./util/Logger.js');
const { DataTypes, Sequelize } = require('sequelize');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let dbURL;
let dialectOptions = {};

if (process.env.DATABASE_URL) {
	dbURL = process.env.DATABASE_URL;
	dialectOptions = {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	};
}
else {
	dbURL = process.env.LOCAL_DATABASE_URL;
}

const sequelize = new Sequelize(dbURL, {
	dialectOptions,
});

sequelize
	.authenticate()
	.then(() => {
		info('Connection has been established successfully.');
	})
	.catch(err => {
		error('Unable to connect to the database:', err);
	});

client.account = sequelize.define('account', {
	discordId: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	linkedAccounts: DataTypes.JSON,
	accountLinking: DataTypes.STRING,
	code: DataTypes.STRING,
});

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

client.modals = new Collection();
const modalFiles = fs.readdirSync('./src/modal/').filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
	const modal = require(`./modal/${file}`);
	info(`Loading modal: ${modal.data.customId}`);
	client.modals.set(modal.data.customId, modal);
	debug(`Loaded modal: ${modal.data.customId}`);
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