const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const fs = require('node:fs');
const Logger = require('./util/Logger');
require('dotenv').config();

// --------------------------------
// Database initialization
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/database.sqlite",
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    Logger.info("Initialized database successfully.");
  })
  .catch((err) => {
    Logger.error("Error initializing database.");
    Logger.debug(err);
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

client.trades = sequelize.define('trades', {
	tradeid : {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4
	},
	discordid: DataTypes.STRING,
	tradestatus: DataTypes.STRING, // pending, created, sold, cancelled
	discordinteractionid : DataTypes.INTEGER,
	offer: DataTypes.JSON,
	request: DataTypes.JSON,
});

// --------------------------------
// Load commands
client.commands = new Collection();
const cmdFiles = fs.readdirSync('./src/cmd/').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const cmd = require(`./cmd/${file}`);
	Logger.info(`Loading command: ${cmd.data.name}`);
	client.commands.set(cmd.data.name, cmd);
	Logger.debug(`Loaded command: ${cmd.data.name}`);
}

// --------------------------------
// Load buttons
client.buttons = new Collection();
const buttonFiles = fs.readdirSync('./src/button/').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const button = require(`./button/${file}`);
	Logger.info(`Loading button: ${button.data.customId}`);
	client.buttons.set(button.data.customId, button);
	Logger.debug(`Loaded button: ${button.data.customId}`);
}

// --------------------------------
// Load modals
client.modals = new Collection();
const modalFiles = fs.readdirSync('./src/modal/').filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
	const modal = require(`./modal/${file}`);
	Logger.info(`Loading modal: ${modal.data.customId}`);
	client.modals.set(modal.data.customId, modal);
	Logger.debug(`Loaded modal: ${modal.data.customId}`);
}

// --------------------------------
// Load events
const eventFiles = fs.readdirSync('./src/event/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./event/${file}`);
	Logger.info(`Loading event: ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
		Logger.debug(`Loaded event: ${event.name}`);
	}
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
		Logger.debug(`Loaded event: ${event.name}`);
	}
}

// --------------------------------

client.login(process.env.TOKEN);