const { MessageEmbed } = require('discord.js');

/**
 * Set welcoming message
 */
module.exports = {
	id: 20,
	name: 'welcome',
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

		const welcomeEtat = await client.db.query(`SELECT etat_msg_wlcm FROM guilds WHERE id='${message.guild.id}'`)
		const welcomeChannel = await client.db.query(`SELECT wlcm_channel_id FROM guilds WHERE id='${message.guild.id}'`)
		const welcomeMessage = await client.db.query(`SELECT message_wlcm FROM guilds WHERE id='${message.guild.id}'`)

		const embed = client.createEmbed(client.color.orange, message, true);

		// explain how to use the command
		if (!args[0]) {
			embed.setDescription(`${language.COMMAND_WELCOME["1"]
				.replace("{state}", welcomeEtat.rows[0].etat_msg_wlcm === true ? "<:Online:696412815363276930> Activé" : "<:Dnd:696412815447031878> Désactivé")
				.replace("{channel}", welcomeChannel.rows[0].wlcm_channel_id === null ? "Aucun salon definie." : `<#${welcomeChannel.rows[0].wlcm_channel_id}>`)
				.replace("{message}", welcomeMessage.rows[0].message_wlcm === null ? " " : welcomeMessage.rows[0].message_wlcm)
				}`)
				.addField(language.USAGE, `\`${prefixe}welcome on/off\` \n\`${prefixe}welcome channel #channel\` \n\`${prefixe}welcome <message>\` \n\`${prefixe}welcome settings\``)

			return message.channel.send(embed);
		}


		//
		if (!['channel', 'on', 'off', 'settings'].includes(args[0])) {
			client.db.query(`SELECT etat_msg_wlcm, wlcm_channel_id FROM guilds WHERE id=$1`, [message.guild.id])
				.then(({ rows }) => {
					if (rows.length === 0) return;

					let missing = "erreur"

					if (rows[0].etat_msg_wlcm === false || rows[0].wlcm_channel_id === null) {
						missing = language.COMMAND_WELCOME["2"]
						if (rows[0].etat_msg_wlcm === false) missing = language.COMMAND_WELCOME["3"]
						if (rows[0].wlcm_channel_id === null) missing = language.COMMAND_WELCOME["4"]
						const embed = client.createEmbed(client.color.red, message)
							.setTitle(missing)
							.setDescription(language.COMMAND_WELCOME["5"]);

						message.channel.send(embed);
					}

					else {
						const reg = new RegExp(`${prefixe}eval`, 'g');
						const msg = args.join(" ").trim().replace(reg, '');

						if (msg.length > 255) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_WELCOME["6"]));
						}

						else if (msg.length < 8) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_WELCOME["7"]));
						}

						else {
							client.db.query(`UPDATE guilds SET message_wlcm=$1 WHERE id=$2`, [msg, message.guild.id])
								.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_WELCOME["8"])))
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
					.setDescription(language.COMMAND_WELCOME["9"])
					.addField(language.USAGE, `\`${prefixe}welcome channel #channel\``)

				return message.channel.send(embed)
			}


			// channel exists
			else {

				let salon = message.guild.channels.cache.get(channel.id)

				if (salon === undefined) {
					embed
						.setDescription(language.COMMAND_WELCOME["10"])
					return message.channel.send(embed);
				}

				const canWrite = channel.permissionsFor(message.guild.me).has('SEND_MESSAGES');

				client.db.query(`UPDATE guilds SET wlcm_channel_id=$1 WHERE id=$2`, [channel.id, message.guild.id])
					.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_WELCOME["11"]
						.replace("{channel}", channel)
						.replace("{canWrite}", canWrite ? '' : language.COMMAND_WELCOME["12"])
					)))
					.catch(err => client.sendError(err, message, true));
			}
		}






		// ON
		else if (args[0] === "on") {
			client.db.query(`UPDATE guilds SET etat_msg_wlcm=true WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_WELCOME["13"])))
				.catch(err => client.sendError(err, message, true));
		}





		// OFF
		else if (args[0] === "off") {
			client.db.query(`UPDATE guilds SET etat_msg_wlcm=false WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_WELCOME["14"])))
				.catch(err => client.sendError(err, message, true));
		}


		// settings
		else if (args[0] === "settings") {
			let embed = client.createEmbed(client.color.orange, message, true)
				.setDescription(language.COMMAND_WELCOME["15"])
			message.channel.send(embed)
		}
	}
}
