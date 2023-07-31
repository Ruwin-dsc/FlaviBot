/**
 * Show infractions of a member
 */
module.exports = {
	id: 23,
	name: 'infractions',
	description: `Permet de voir les warns d'un utilisateur`,
	arguments: `@mention`,
	userPerms: ['DEV', 'MANAGE_MESSAGES'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, true);

		const member = message.mentions.users.first();

		// member exists
		if(member) {

			embed
				.setThumbnail(member.avatarURL({ format: 'png' }))

			// has at least one warn
			try {
				embed.addField(`Nombre de warn :`, `**${client.warn.get(`${message.guild.id}-${member.id}`, "warnings")}**`);
			}

			// hasn't any warn
			catch(err) {
				embed.setDescription(`Ce membre n'a commis aucune infraction`);
			}

		}
		
		// member does not exist
		else {

			embed
				.setDescription(`Veuillez indiquer une personne !`)
				.addField(`Utilisation :`, `${this.usage}`);
				
		}
			
		message.channel.send(embed);
	}
};