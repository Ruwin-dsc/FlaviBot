/**
 * Show donation paypal's link
 */
module.exports = {
	id: 1,
	name: 'don',
	description: `Permet de faire un don`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true)
			.setDescription(`${language.COMMAND_DONATE}`);
		
		message.channel.send(embed).catch(e => console.error('Command: don error'));
	}
};
