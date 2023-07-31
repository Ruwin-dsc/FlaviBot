/**
 * Show support server's link
 */
module.exports = {
	id: 14,
	name: 'support-server',
	aliases: ['support'],
	description: `Permet d'avoir le serveur du Support de FlaviBot`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {
		
		message.channel.send(`${language.COMMAND_SUPPORT_SERVER}`);

	}
};