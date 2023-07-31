/**
 * Set autorole that's automatically added on a member that joins the guild
 */
module.exports = {
	id: 17,
	name: 'autorole',
	description: "Permet de configurer l'auto-rôle sur votre serveur",
	arguments: '@role | "on" | "off"',
	userPerms: ['DEV', 'MANAGE_GUILD'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		// no role mentionned
		if (!args[0]) {
			const embed = client.createEmbed(client.color.fail, message, true)
				.setDescription(`${language.COMMAND_AUTOROLE["1"]}\nhttps://flavibot.xyz/`)
				.addField(`${language.USAGE}`, `${this.usage}`, true);

			return message.channel.send(embed);
		}


		if (args[0] === 'on') {
			client.db.query(`UPDATE guilds SET etat_autorole=true WHERE id=$1`, [message.guild.id])
				.then(({ rows }) => {
					const embed = client.resultEmbed(client.color.success)
						.setDescription(`${language.COMMAND_AUTOROLE["2"]}`);

					message.channel.send(embed);
				})
				.catch(err => client.sendError(err, message, true));
		}



		else if (args[0] === 'off') {
			client.db.query(`UPDATE guilds SET etat_autorole=false WHERE id=$1`, [message.guild.id])
				.then(({ rows }) => {
					const embed = client.resultEmbed(client.color.success)
						.setDescription(`${language.COMMAND_AUTOROLE["3"]}`);

					message.channel.send(embed);
				})
				.catch(err => client.sendError(err, message, true));
		}



		else {

			// get the role
			const role = message.guild.roles.cache.get(message.mentions.roles.first()?.id);



			// role does not exist
			if (!role) {
				const embed = client.createEmbed(client.color.fail, message, true)
					.setDescription(`${language.COMMAND_AUTOROLE["4"]}`)
					.addField(`${language.USAGE}`, `${this.usage}`);

				return message.channel.send(embed);
			}




			// cannot add this role (hierarchically)
			if (message.guild.members.cache.get(client.user.id).roles.highest.position <= role.position) {
				return message.channel.send(client.resultEmbed(client.color.fail, `${language.COMMAND_AUTOROLE["5"]}`));
			}


			// update database's row for the autorole that will be added to each new members
			client.db.query(`UPDATE guilds SET id_autorole=$1, etat_autorole=true WHERE id=$2`, [role.id, message.guild.id])
				.then(({ rows }) => {
					const embed = client.createEmbed(client.color.success, message, true)
						.setDescription(`${language.COMMAND_AUTOROLE["6"].replace("{role}", role)}`);

					message.channel.send(embed);
				})
				.catch(err => client.sendError(err, message, true));

		}

	}
}
