/**
 * Same as say command, but with an embed
 */
module.exports = {
	id: 59,
	name: 'sayembed',
	description: `Permet d'envoyer un embed en passant par le bot`,
	usage: `!say <message>`,
	permissions: ['MANAGE_MESSAGES'],
	userPerms: ['DEV', 'MANAGE_MESSAGES'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, false);

		const sayMessage = args.join(' ');

		if(sayMessage) {
			message.delete().catch(e => console.log(e));
			embed.setDescription(sayMessage);
		}
		
		else {
			embed
				.setDescription(`Veuillez indiquer un message à envoyer !`)
				.addField(`Utilisation :`, `${this.usage}`);
		}
			
		message.channel.send(embed);

	}
};