const { realpathSync } = require('fs');

// Discord
const Discord = require('discord.js');
const client = new Discord.Client({ fetchAllmember: true });




// root path
const root = __dirname;

// project root
const projectRoot = realpathSync(`${root}/..`);

//
const configDir = root + '/config';





// config & constants
const config = require(`${configDir}/config.json`);
const constants = require(`${configDir}/constants.json`);


//
const preload = require(`.${config.discord.paths.modules}/preload.js`);



// go up a folder to get the project root
client.projectRoot = projectRoot;

// so now we can access to the root path of the project everytime you put `client` as argument
client.root = root;


client.config = config.discord;

client.prefix = client.config.prefix;


for (let key of Object.keys(constants)) {
	client[key] = constants[key];
}


// initialize all webhooks
client.wh = {};

for (let wh of Object.keys(client.config.webhooks)) {
	client.wh[wh] = new Discord.WebhookClient(client.config.webhooks[wh].id, client.config.webhooks[wh].key);
}



// client.channel already exists. It's a built-in of Discord.js

client._channels_ = client.config.channels;


// music list
client.music = {};


// custom prefixes "cache"
client.prefixes = {};

// all langs
client.langs = require(`${client.root}/${client.config.paths.json}/langs.json`);


// commands and aliases
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();





// forbidden words
client.forbiddenWords = [client.token, config.database.password, client.config.youtubeAPI, client.config.topggtoken, config.database.user, client.config.dbname];




client.guildInvites = new Map();





// create new database link
const Database = require(`${client.root + client.config.paths.modules}/Database.js`);

client.db = new Database(config.database);

client.db.connect();






// preload
preload.loadUtils(client);
preload.loadExtras(client);

// commands & events
preload.loadCommands(client)
	.then(() => preload.loadEvents(client))
	.catch(err => client.sendError(err, 'preload'));





// log in the bot
client.login(config.token);