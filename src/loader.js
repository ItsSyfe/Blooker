const fs = require('fs');
const { DataTypes, Sequelize } = require('sequelize');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const sequelize = new Sequelize(`${process.env.DATABASE_URI}?sslmode=require`, {
	url: process.env.DATABASE_URI,
	dialect: 'postgres',
	// logging: false,
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

client.account = sequelize.define('account', {
	discordId: {
		type: DataTypes.INTEGER,
		unique: true,
		allowNull: false,
	},
	linkedAccounts: DataTypes.JSON,
	accountLinking: DataTypes.STRING,
	code: DataTypes.STRING,
});

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