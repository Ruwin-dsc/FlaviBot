const { MessageEmbed } = require('discord.js');

/**
 * Set welcoming message
 */
module.exports = {
	id: 93,
	name: 'level',
	description: `Permet de mettre en place les messages de bienvenue`,
	arguments: `<message>`,
	userPerms: ['DEV', 'MANAGE_GUILD'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const prefixe = client.prefixes[message.guild.id];

		const levelEtat = await client.db.query(`SELECT etat_msg_lvl FROM guilds WHERE id='${message.guild.id}'`)
		const levelChannel = await client.db.query(`SELECT lvl_channel_id FROM guilds WHERE id='${message.guild.id}'`)
		const levelMessage = await client.db.query(`SELECT message_lvl FROM guilds WHERE id='${message.guild.id}'`)

		const embed = client.createEmbed(client.color.orange, message, true);

		// explain how to use the command
		if (!args[0]) {
			embed.setDescription(`${language.COMMAND_LEVEL["1"]
				.replace("{state}", levelEtat.rows[0].etat_msg_lvl === true ? "<:Online:696412815363276930> Activé" : "<:Dnd:696412815447031878> Désactivé")
				.replace("{channel}", levelChannel.rows[0].lvl_channel_id === null ? "Aucun salon definie." : `<#${levelChannel.rows[0].lvl_channel_id}>`)
				.replace("{message}", levelMessage.rows[0].message_lvl === null ? " " : levelMessage.rows[0].message_lvl)
				}`)

				.addField(language.USAGE, `\`${prefixe}level on/off\` \n\`${prefixe}level channel #channel\` \n\`${prefixe}level <message>\` \n\`${prefixe}level settings\``)

			return message.channel.send(embed);
		}


		//
		if (!['channel', 'on', 'off', 'settings'].includes(args[0])) {
			client.db.query(`SELECT etat_msg_lvl FROM guilds WHERE id='${message.guild.id}'`)
				.then(({ rows }) => {
					if (rows.length === 0) return;

					let missing = "erreur"

					if (rows[0].etat_msg_lvl === false || rows[0].lvl_channel_id === null) {
						missing = language.COMMAND_LEVEL["2"]
						if (rows[0].etat_msg_lvl === false) missing = language.COMMAND_LEVEL["3"]
						if (rows[0].lvl_channel_id === null) missing = language.COMMAND_LEVEL["4"]
						const embed = client.createEmbed(client.color.red, message)
							.setTitle(missing)
							.setDescription(language.COMMAND_LEVEL["5"].replace("{prefixe + name}", prefixe + this.name));

						message.channel.send(embed);
					}

					else {
						const reg = new RegExp(`${prefixe}eval`, 'g');
						const msg = args.join(" ").trim().replace(reg, '');

						if (msg.length > 255) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_LEVEL["6"]));
						}

						else if (msg.length < 8) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_LEVEL["7"]));
						}

						else {
							client.db.query(`UPDATE guilds SET message_lvl=$1 WHERE id=$2`, [msg, message.guild.id])
								.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEVEL["8"])))
								.catch(err => client.sendError(err, message, true));
						}
					}
				})
				.catch(err => client.sendError(err, message, true));
		}

		// CHANNEL
		else if (args[0] === "channel") {
			const channel = message.mentions.channels.first();


			// selected channel does not exist
			if (!channel?.id) {
				let embed = client.createEmbed(client.color.orange, message, true)
					.setDescription(language.COMMAND_LEVEL["9"])
					.addField(language.USAGE, `\`${prefixe}level channel #channel\``)

				return message.channel.send(embed)
			}


			// channel exists
			else {

				let salon = message.guild.channels.cache.get(channel.id)

				if (salon === undefined) {
					embed
						.setDescription(language.COMMAND_LEVEL["10"])
					return message.channel.send(embed);
				}

				const canWrite = channel.permissionsFor(message.guild.me).has('SEND_MESSAGES');

				client.db.query(`UPDATE guilds SET lvl_channel_id=$1 WHERE id=$2`, [channel.id, message.guild.id])
					.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEVEL["11"]
						.replace("{channel}", channel)
						.replace("{canWrite}", canWrite ? '' : language.COMMAND_LEVEL["12"])
					)))
					.catch(err => client.sendError(err, message, true));
			}
		}




		// ON
		else if (args[0] === "on") {
			client.db.query(`UPDATE guilds SET etat_msg_lvl=true WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEVEL["13"])))
				.catch(err => client.sendError(err, message, true));
		}





		// OFF
		else if (args[0] === "off") {
			client.db.query(`UPDATE guilds SET etat_msg_lvl=false WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEVEL["14"])))
				.catch(err => client.sendError(err, message, true));
		}

		// settings
		else if (args[0] === "settings") {
			let embed = client.createEmbed(client.color.orange, message, true)
				.setDescription(language.COMMAND_LEVEL["15"])
			message.channel.send(embed)
		}
	}

}
