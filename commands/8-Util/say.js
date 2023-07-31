/**
 * Tell the bot to say what we sent
 */
module.exports = {
	id: 58,
	name: 'say',
	description: `Permet d'écrire un message en passant par le bot`,
	arguments: `<message>`,
	userPerms: ['DEV', 'MANAGE_MESSAGES'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);

		const sayMessage = args.join(" ");

		if(sayMessage) {

			message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES') ? message.delete() : ""
			

			const finalResult = sayMessage.replace("@everyone", "@ everyone").replace("@here", "@ here")

			message.channel.send(finalResult);
		}
		
		else {
			embed
				.setDescription(`Veuillez indiquer un message à envoyer !`)
				.addField(`Utilisation :`, `${this.usage}`);

			message.channel.send(embed);
		}

	}
};