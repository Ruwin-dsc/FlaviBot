/**
 * Show Bot statistics
 */
module.exports = {
	id: 13,
	name: 'stats',
	description: `Permet d'avoir des information sur les développeurs et le bot`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {
		
		const { getPingEmbed } = client.loadModule('utils');
		const embed = await getPingEmbed(client, message);
		client.removeModule('utils');

		message.channel.send(embed);
	}
};