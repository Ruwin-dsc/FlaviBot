const fs = require('fs');

/**
 * Reload commands or components
 */
module.exports = {
	id: 9,
	name: 'reload',
	restricted: true,
	hidden: true,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		message.channel.send('<a:chargement:727228583310917734> Reload en cours...').then(msg => {
			try {
				// show possible options
				if(args.length == 0) {
					const embed = client.createEmbed(client.color.blue, message)
						.addFields(
							{name: "Reload une commande :", value: `${this.usage} \`<commandFilename>\``},
							{name: "Ajouter une commande :", value: `${this.usage} \`--add <commandFilename>\``},
							{name: "Enlever une commande :", value: `${this.usage} \`--delete <commandName>\``},
							{name: "Reload un fichier config :", value: `${this.usage} \`-c <filename>\``},
							{name: "Reload un event handler :", value: `${this.usage} \`-e <eventName>\``}
						);

					msg.edit('', {embed});
				}
				
				// has an option
				else if(args.length == 1) {
					if(Object.values(this.reloadOptions).includes(args[0])) {
						const embed = client.createEmbed(client.color.blue, message)
							.setDescription(
								Object.keys(this.reloadOptions).map(key => `• **${key} :** \`${this.reloadOptions[key]}\``).join('\n')
							);

						msg.edit('', {embed});
					}

					else {
						this.loadCommand(client, msg, args);
					}
				}

				else if(args.length == 2) {
					if(Object.values(this.reloadOptions).includes(args[0])) {
						this.loadComponent(client, msg, args);
					}

					else if(args[0] == '--add') {
						this.addCommand(client, msg, args[1]);
					}

					else if(args[0] == '--delete') {
						this.deleteCommand(client, msg, args[1]);
					}

					else {
						msg.edit(":x: Option invalide.");
					}
				}

				else {
					msg.edit('', client.resultEmbed(client.color.fail, ":x: Nombre d'argument donné incorrect."));
				}
			}

			catch(error) {
				client.sendError(error, message);
				msg.edit('', client.resultEmbed(client.color.fail, ":x: Une erreur est survenue."));
			}

		});

	},



	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {array<string>} args
	 */
	async loadCommand(client, msg, args) {
		// list all directories of the commands Dir'
		const { getDirectories } = client.loadModule('utils');


		const commandsDir = client.root + client.config.paths.commands;
		const directories = getDirectories(commandsDir);

		let folder = 0;

		const command = args[0];

		// for each sub-folder of the commands folder
		while(folder < directories.length) {
			const folderPath = `${commandsDir}/${directories[folder]}`;

			if(fs.existsSync(`${folderPath}/${args[0]}.js`)) {
				try {
					const props = require(`${folderPath}/${args[0]}.js`);

					// if the command already exists on the client commands, reload it
					if(client.commands.has(props.name)) { 
						props.usage = '`' + client.prefix + props.name + (props.arguments? ' '+props.arguments : '') + '`';
						props.category = directories[folder].replace(/^\d+\-/, '').toLowerCase();

						await client.commands.delete(props.name);
						await client.commands.set(props.name, props);

						// need to check for aliases
					}

					delete require.cache[require.resolve(`${folderPath}/${args[0]}.js`)];

					client.removeModule('utils');

					return msg.edit('', client.resultEmbed(client.color.success, `:white_check_mark: La commande \`${command}\` a bien été reload.`));
				}

				catch(error) {
					client.sendError(error, msg);
					return msg.edit('', client.resultEmbed(client.color.fail, ":x: Une erreur est survenue, sûrement parce que le fichier à loader contient une erreur."));
				}
			}

			folder++;
		}

		client.removeModule('utils');
		
		return msg.edit('', client.resultEmbed(client.color.fail, ":x: La commande est introuvable."));
	},






	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {array<string>} args
	 */
	async loadComponent(client, msg, args) {
		const componentFolder = Object.keys(this.reloadOptions)[Object.values(this.reloadOptions).indexOf(args[0])];
		const filename = args[1];
		const path = ((componentFolder == 'config')? client.projectRoot : client.root) + `/${componentFolder}/${filename}.js${(componentFolder == 'config')?'on':''}`;

		const fileExists = fs.existsSync(path);

		// msg.edit(`componentFolder: ${componentFolder}\nfilename: ${filename}\npath: ${path}\nfile exists: ${fileExists}`);

		if(fileExists) {
			const componentReloadMethod = this[`reload_${componentFolder}`];

			if(componentReloadMethod) {
				const module = require(path);

				const resultSentence = (await componentReloadMethod(client, msg, {filename, path, module}))?? ":white_check_mark: Composant actualisé.";
				
				delete require.cache[require.resolve(path)];

				msg.edit('', client.resultEmbed(client.color.success, resultSentence));
			}

			else {
				msg.edit('', client.resultEmbed(client.color.fail, ":x: Je n'ai pas pu reload le composant."));
			}
		}

		else {
			msg.edit('', client.resultEmbed(client.color.fail, ":x: composant introuvable."));
		}
	},


	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {string} filename
	 * @param {string} path
	 * @param {module} module
	 */
	async reload_config(client, msg, {filename, path, module}) {
		if(filename === 'config') {

			client.config = _module.discord;

			client._channels_ = client.config.channels;
			client.prefix = client.config.prefix;

			client.wh = {};
			
			for(let wh of Object.keys(client.config.webhooks)) {
				client.wh[wh] = new Discord.WebhookClient(client.config.webhooks[wh].id, client.config.webhooks[wh].key);
			}			
		}

		else if(filename === 'constants') {
			for(let key of Object.keys(_module)) {
				client[key] = _module[key];
			}
		}
	},

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {string} filename
	 * @param {string} path
	 * @param {module} module
	 */
	async reload_events(client, msg, {filename, path, module}) {
		try {
			client.removeAllListeners(filename);

			const event = new module(client);

			client.loadEvent(filename, event);
		}

		catch(error) {
			client.sendError(err);
			return ":x: Je n'ai pas pu reload cet event.";
		}
	},

	async reload_extra(client, msg, {filename, path, module}) {
		return ":hourglass: Pour l'instant il est inutile de reload un extra";
	},

	async reload_modules(client, msg, {filename, path, module}) {
		return "Les modules sont required dynamiquement. Il est inutile de les reload.\nPour le `preload.js`, il faut nécessairement restart le bot.";
	},



	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {string} filename
	 */
	async addCommand(client, msg, filename) {

		// list all directories of the commands Dir'
		const { getDirectories, isCommand } = client.loadModule('utils');

		const commandsDir = client.root + client.config.paths.commands;
		const directories = getDirectories(commandsDir);

		let folder = 0;

		// for each sub-folder of the commands folder
		while(folder < directories.length) {
			const folderPath = `${commandsDir}/${directories[folder]}`;

			if(fs.existsSync(`${folderPath}/${filename}.js`)) {
				const props = require(`${folderPath}/${filename}.js`);

				const isCmd = isCommand(props);
				const isUniqueId = isCmd? !client.commands.map(c => c.id).includes(props.id) : false;

				// if the command already exists on the client commands, reload it
				if(!isCmd || !isUniqueId) {
					msg.edit('', client.resultEmbed(client.color.fail, ":x: Cette commande n'est pas bien construite ou a un id déjà pris."));
				}

				else if(!client.commands.has(props.name)) { 
					props.usage = '`' + client.prefix + props.name + (props.arguments? ' '+props.arguments : '') + '`';
					props.category = directories[folder].replace(/^\d+\-/, '').toLowerCase();

					await client.commands.set(props.name, props);

					msg.edit('', client.resultEmbed(client.color.success, `:white_check_mark: La commande \`${filename}\` a bien été ajoutée à la collection.`));
				}
				
				else {
					msg.edit('', client.resultEmbed(client.color.fail, ":x: Cette commande existe déjà dans la collection."));
				}

				delete require.cache[require.resolve(`${folderPath}/${filename}.js`)];

				client.removeModule('utils');

				return;
			}

			folder++;
		}

		msg.edit('', client.resultEmbed(client.color.fail, ":x: Commande introuvable."));
	},

	/**
	 * @param {Client} client
	 * @param {Message} msg
	 * @param {string} commandName
	 */
	async deleteCommand(client, msg, commandName) {
		if(client.commands.has(commandName)) {
			await client.commands.delete(commandName);

			msg.edit('', client.resultEmbed(client.color.success, ":white_check_mark: Commande retirée de la collection."));
		}


		else {
			msg.edit('', client.resultEmbed(client.color.fail, ":x: Commande introuvable."));
		}
	},



	reloadOptions: {
		"config":	"-c",
		"events":	"-e",
		"extra":	"-x",
		"modules":	"-m"
	}
};