/**
 * Show a ban list members.
 */
module.exports = {
	id: 86,
	name: 'banlist',
	description: `Permet de voir tout les membres banni.`,
	inDev: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {
		const embed = client.createEmbed(client.color.blue, message, true)
			.setDescription(
				`Voici la liste des personnes banni du serveur : `+
				`PA ENKOR !!!`
			);
		
		message.channel.send(embed)
	}
};