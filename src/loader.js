const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], allowedMentions: { parse: ['roles'], repliedUser: false } });

const fs = require('node:fs');
const Logger = require('./util/Logger');
require('dotenv').config();

// --------------------------------
// Database initialization
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = process.env.DATABASE_URL ? 
new Sequelize(process.env.DATABASE_URL, {
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	}
  })
  : 
new Sequelize({
	dialect: "sqlite",
	storage: "./data/database.sqlite",
	logging: false
})

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
	discordid: DataTypes.STRING,
	discordinteractionid : DataTypes.INTEGER,
	tradestatus: DataTypes.STRING, // pending, complete, sold, cancelled
	offer: DataTypes.JSON,
	request: DataTypes.JSON,
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	}
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
// Load select menus
client.selectMenus = new Collection();
const selectMenuFiles = fs.readdirSync('./src/select/').filter(file => file.endsWith('.js'));

for (const file of selectMenuFiles) {
	const select = require(`./select/${file}`);
	Logger.info(`Loading select menu: ${select.data.customId}`);
	client.selectMenus.set(select.data.customId, select);
	Logger.debug(`Loaded select menu: ${select.data.customId}`);
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