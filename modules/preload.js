// LOAD ALL PRE-REQUIERED


// modules for path, file & dir
const path = require("path");
const fs = require('fs');

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const { getDirectories } = require('./utils.js');

const { MessageEmbed } = require('discord.js');





/**
 * load all commands
 * @param {Client} client
 */
module.exports.loadCommands = async client => {

	// get the commands directory
	const commandsDir = client.root + client.config.paths.commands;
	const directories = getDirectories(commandsDir);

	// function that check if the "command" is really one
	const { isCommand } = client.loadModule('utils');

	// get the right catergories order (from the folder order)
	client.categoryOrder = [];

	// for each sub-folder of the commands folder
	for(let folder=0; folder < directories.length; folder++) {
		fs.readdir(`${commandsDir}/${directories[folder]}`, (err, files) => {
			// error while loading a command directory
			if(err) {
				return console.error(`This command folder cannot be read: ${directories[folder]}\n\t${err}`);
			}

			// the folder must be named by [number]-[letters|numbers]
			if(!/^\d+\-\w+$/.test(directories[folder])) {
				return console.warn(`This command folder is not well named: ${directories[folder]}`);
			}

			// category name (without the [number]- at the beginning)
			const category = directories[folder].replace(/^\d+\-/, '').toLowerCase();

			// get its order
			const nCat = parseInt(directories[folder].replace(/^(\d+)\-\w+$/, '$1'));

			// add it to the order
			client.categoryOrder[nCat] = category;

			// for each file (command) of a command directory
			files.forEach(file => {
				// it must be a js file
				if(!file.endsWith(".js")) {
					return undefined;
				}

				// get the command
				const cmd = require(`${commandsDir}/${directories[folder]}${path.sep}${file}`);

				// check if it's a well formed command
				const isCmd = isCommand(cmd);

				// must contain a unique id and unique name
				const isUniqueId = isCmd? !client.commands.map(c => c.id).includes(cmd.id) : false;

				// verify cmd is well formed
				if(isCmd && isUniqueId) {

					// set the category of the command thanks the folder name it's in
					cmd.category = category;

					// set the command's usage
					cmd.usage = '`' + client.prefix + cmd.name + (cmd.arguments? ' '+cmd.arguments : '') + '`';


					// add command to commands list
					client.commands.set(cmd.name, cmd);

					// commands contains aliases
					if('aliases' in cmd) {
						cmd.aliases.forEach(alias => {
							client.aliases.set(alias, cmd.name);
						});
					}

				}

				// not a clean command
				else {
					if(!isCmd) {
						console.log(`- Command not added because not respecting required properties: "${cmd.name?? '[NoNameProvided]'}".`);
					}

					else if(!isUniqueId) {
						console.log(`- Command not added because its ID is already taken by another command: "${cmd.name?? '[NoNameProvided]'}".`);
					}

					else {
						console.log(`- Command not loaded: "${cmd.name?? '[NoNameProvided]'}".`);
					}
				}

				// remove command's cache
				delete require.cache[require.resolve(`${commandsDir}/${directories[folder]}${path.sep}${file}`)];
			});
		});
	}


	client.removeModule('utils');

};


/**
 * load all extras
 * @param {Client} client
 */
module.exports.loadExtras = client => {

	// extra path
	const extraDir = client.root + client.config.paths.extra;

	// TOP.gg stats
	require(`${extraDir}/topgg.js`)(client);

	// giveaway manager
	client.giveawaysManager = require(`${extraDir}/giveaway.js`)(client);

	// enmap
	require(`${extraDir}/enmap.js`)(client);

    // ping
	require(`${extraDir}/ping.js`)(client);

	// Socket
	require(`${extraDir}/socket.js`)(client);

};





/**
 * load / create all utils methods
 * @param {Client} client
 */
module.exports.loadUtils = client => {
	/**
	 * Check if the given user belongs to developers team
	 * @param {string} userId the Discord user id
	 */
	client.isDev = userId => client.developers.includes(userId);


	/**
	 * create a new prefedined embed
	 * @param {string} color embed left-side's color
	 * @param {User} author Discord's user
	 * @return {MessageEmbed}
	 */
	client.createEmbed = (color, message, showAuthor=false) => {
		const embed = new MessageEmbed()
			.setColor(color)
			.setTimestamp()
			.setFooter(client.footerT(message.guild?.id), client.footerI());

		if(showAuthor !== null) {
			embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		}

		return embed;
	};

	client.getMember = async (message, args) => {
		let memberM = null;
	  
		try {     
		  if(args.length > 0) {
			memberM = await client.users.fetch(message.mentions.users.last()?.id || args[0]);
		  }
	  
		  else {
			memberM = message.member.user;
		  }
	   
		} catch (e){
		  memberM = null;
		}
	  
		return memberM;
	  };


	/**
	 * Create an error embed
	 * @param {string} error
	 * @return {MessageEmbed}
	 */
	client.errorEmbed = error => {
		return new MessageEmbed()
			.setTitle(':x: ERROR')
			.setColor(client.color.orange)
			.setDescription('```' + error + '```');
	};


	/**
	 * Create a result embed
	 * @param {string} color embed left-side color
	 * @param {string} msg message to send
	 * @return {MessageEmbed}
	 */
	client.resultEmbed = (color, msg) => {
		return new MessageEmbed()
			.setColor(color)
			.setDescription(`**${msg}**`);
	};

	/**
	 * Send the given error to the console and can send a message on Discord
	 * @param {string} error
	 * @param {Message|String} message either Message object or string that tell us on which file the error occured
	 */
	client.sendError = (error, message, msg=false) => {
		// log the error on the console
		console.error('sendError: ', error);
		
		// if send a basic message
		if(msg === true) {
			msg = 'Une erreur est survenue';
		}

		// if we have to send a message to the discord's channel to prevent
		if(msg !== false && typeof message === 'object') {
			message.channel.send(client.resultEmbed(client.color.orange, msg)).catch(e => console.error('sendError error'));
		}


		const embed = new MessageEmbed()
			.setColor(client.color.orange)
			.setDescription('```' + error + '```')
			.setTimestamp();


		if(typeof message === 'object') {
			// log on the webhook
			embed
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle(`Error`)
				.setFooter(message.guild.name, message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : "https://flavibot.xyz/public/images/noticon.png");
			
		}

		else {
			embed
				.setTitle(`Error`)
				.setFooter(message, client.footerI());
		}

		client.wh.logsErrors.send(embed).catch(e => console.error('WebHooks error preload'));
	}
	



	/**
	 * load a module file
	 * @param {string} moduleName
	 * @return {module}
	 */
	client.loadModule = moduleName => require(`${client.root + client.config.paths.modules}/${moduleName}.js`);

	/**
	 * Remove a loaded module file
	 * @param {string} moduleName
	 */
	client.removeModule = moduleName => {
		const res = require.resolve(`${client.root + client.config.paths.modules}/${moduleName}.js`);

		if(res in require.cache) {
			delete require.cache[res];
		}
	};


	/**
	 * Send a dynamic footer text about the bot
	 * @return {string}
	 */
	client.footerT = (guildId=null) => `${client.user.username} v${client.version} | ${client.prefixes[guildId]?? client.prefix}help`;

	/**
	 * Send the client avatar
	 * @return {string}
	 */
	client.footerI = () => client.user.displayAvatarURL({ dynamic: true });



	/**
	 * Load an event and call it when this event occurs
	 * @param {string} eventName
	 * @param {function} event
	 */
	client.loadEvent = (eventName, event) => {
		if(eventName !== 'message') {
			client.on(eventName, (...args) => event.run(...args));
		}

		// need to do special things if it's a message event handler
		else {
			client.on('message', (...args) => {
				if(args[0].author.bot) return;

				// if the bot is in maintenance
				// args[0] is `message`
				if(client.config.maintenance && !client.developers.includes(args[0].author.id)) {
					if(args[0].content.startsWith(client.prefixes[args[0].guild.id]) && client.commands.has(args[0].content.slice(client.prefixes[args[0].guild.id].length).trim().split(' ')[0])) {
						const embed = new MessageEmbed()
							.setColor(client.color.blue)
							.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
							.setTitle('Maintenance en cours')
							.setDescription("<a:chargement:727228583310917734> Maintenance en cours... \nVous pouvez rejoindre le [serveur du support](https://discord.gg/zJyE39J) pour plus d'informations.")
							.setFooter(client.footerT(args[0].guild?.id), client.footerI());
						return args[0].channel.send(embed).catch(e => {});
					}
				}

				// not in maintenance
				else {
					event.run(...args);
				}
			});
		}
	};


	client.refreshAllPrefixes = async () => {
		if(client.db.link === null) return;
		
		const result = await client.db.query(`SELECT id, prefix FROM guilds`);

		if(!result) return;

		const prefixes = {};
				
		result.rows.map(row => {
			prefixes[row.id] = row.prefix?? client.prefix;
		});

		client.guilds.cache.each(guild => {
			client.prefixes[guild.id] = prefixes[guild.id]?? client.prefix;
		});

		console.log('Les prefixes de tous les serveurs ont été refresh !');
	};



	client.format = (string, obj) => {
		const matches = string.match(/\{[a-zA-Z]+\}/g);

		if(!matches) return string;

		for(const m of matches) {
			if(m.replace(/(\{|\})+/g, '') in obj) {
				string = string.replace(m, obj[m.replace(/(\{|\})+/g, '')]);
			}
		}

		return string;
	};



	client.formatNumber = x => {
		x = x.toString();
	
		if(x.length > 3) {
	
			let letter, nk;
	
			if(x.length < 7) {
				[letter, nk] = ['k', 3];
			}
	
			else if(x.length < 10) {
				[letter, nk] = ['M', 6];
			}
	
			const a = x.substring(0, x.length - nk);
			const b = x.substring(a.length).substring(0, 3 - a.length);
	
			x = a + ((parseInt(b) > 0)? '.' + b : '') + 'k';
	
		}
	
		return x;
	};
};





/**
 * load all Discord events
 * @param {Client} client
 */
module.exports.loadEvents = async client => {

	client.categoryOrder = client.categoryOrder.filter(cat => typeof cat === 'string');


	const eventsDir = client.root + client.config.paths.events;

	// get all Discord events that are registered in a file
	const evtFiles = await readdir(eventsDir);

	if(client.shard.ids.includes(client.shard.count - 1)) {
		console.log(`Chargement de ${evtFiles.length} événements et ${client.commands.size} commandes !`);
	}

	// bind event from file
	evtFiles.forEach(file => {
		const eventName = file.split(".")[0];
		const event = new (require(`${eventsDir}/${file}`))(client);

		// bind
		client.loadEvent(eventName, event);

		// we do no long need this as a require / class, because the event is binded
		delete require.cache[require.resolve(`${eventsDir}/${file}`)];
	});
};