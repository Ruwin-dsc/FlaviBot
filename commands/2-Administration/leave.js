/**
 * Put departure message
 */
module.exports = {
	id: 18,
	name: 'leave',
	description: `Permet de mettre en place les messages de départ`,
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

		const leaveEtat = await client.db.query(`SELECT etat_msg_leave FROM guilds WHERE id='${message.guild.id}'`);
		const leaveChannel = await client.db.query(`SELECT leave_channel_id FROM guilds WHERE id='${message.guild.id}'`);
		const leaveMessage = await client.db.query(`SELECT message_leave FROM guilds WHERE id='${message.guild.id}'`);

		const embed = client.createEmbed(client.color.orange, message, true);


		// explain how to use the command
		if (!args[0]) {
			embed
				.setDescription(`${language.COMMAND_LEAVE["1"]
					.replace("{state}", leaveEtat.rows[0].etat_msg_leave === true ? "<:Online:696412815363276930> Activé" : "<:Dnd:696412815447031878> Désactivé")
					.replace("{channel}", leaveChannel.rows[0].leave_channel_id === null ? "Aucun salon definie." : `<#${leaveChannel.rows[0].leave_channel_id}>`)
					.replace("{message}", leaveMessage.rows[0].message_leave === null ? " " : leaveMessage.rows[0].message_leave)
					}`)

				.addField(language.USAGE, `\`${prefixe}leave on/off\` \n\`${prefixe}leave channel #channel\` \n\`${prefixe}leave <message>\` \n\`${prefixe}leave settings\``)

			return message.channel.send(embed);
		}




		//
		if (!['channel', 'on', 'off'].includes(args[0])) {
			client.db.query(`SELECT etat_msg_leave, leave_channel_id FROM guilds WHERE id=$1`, [message.guild.id])
				.then(({ rows }) => {
					if (rows.length === 0) return;

					let missing = "erreur"

					if (rows[0].etat_msg_leave === false || rows[0].leave_channel_id === null) {
						missing = language.COMMAND_LEAVE["2"]
						if (rows[0].etat_msg_leave === false) missing = language.COMMAND_LEAVE["3"]
						if (rows[0].leave_channel_id === null) missing = language.COMMAND_LEAVE["4"]
						const embed = client.createEmbed(client.color.red, message)
							.setTitle(missing)
							.setDescription(language.COMMAND_LEAVE["5"].replace("{prefixe + name}", prefixe + this.name));

						message.channel.send(embed);
					}

					else {
						const reg = new RegExp(`${prefixe}eval`, 'g');
						const msg = args.join(" ").trim().replace(reg, '');

						if (msg.length > 255) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_LEAVE["6"]));
						}

						else if (msg.length < 8) {
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_LEAVE["7"]));
						}

						else {
							client.db.query(`UPDATE guilds SET message_leave=$1 WHERE id=$2`, [msg, message.guild.id])
								.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEAVE["8"])))
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
					.setDescription(language.COMMAND_LEAVE["9"])
					.addField(language.USAGE, `\`!leave channel #channel\``)

				return message.channel.send(embed)
			}


			// channel exists
			else {

				let salon = message.guild.channels.cache.get(channel.id)

				if (salon === undefined) {
					embed
						.setDescription(language.COMMAND_LEAVE["11"])
					return message.channel.send(embed);
				}

				const canWrite = channel.permissionsFor(message.guild.me).has('SEND_MESSAGES');

				client.db.query(`UPDATE guilds SET leave_channel_id=$1 WHERE id=$2`, [channel.id, message.guild.id])
					.then(res =>
						message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEAVE["11"]
							.replace("{channel}", channel)
							.replace("{canWrite}", canWrite ? '' : language.COMMAND_LEAVE["12"])
						)))
							.catch(err => client.sendError(err, message, true));
			}
		}






		// ON
		else if (args[0] === "on") {
			client.db.query(`UPDATE guilds SET etat_msg_leave=true WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEAVE["13"])))
				.catch(err => client.sendError(err, message, true));
		}





		// OFF
		else if (args[0] === "off") {
			client.db.query(`UPDATE guilds SET etat_msg_leave=false WHERE id=$1`, [message.guild.id])
				.then(res => message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_LEAVE["14"])))
				.catch(err => client.sendError(err, message, true));
		}


		// settings
		else if (args[0] === "settings") {
			let embed = client.createEmbed(client.color.orange, message, true)
				.setDescription(language.COMMAND_LEAVE["15"])
			message.channel.send(embed)

		}




	}
}
