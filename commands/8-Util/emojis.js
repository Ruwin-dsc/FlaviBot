/**
 * Shows guild's emojis
 */
module.exports = {
	id: 51,
	name: 'emojis',
	description: `Permet d'avoir la liste des emojis sur le serveur discord`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const emojis = message.guild.emojis.cache.array().sort((a, b) => a.animated && !b.animated ? 1 : -1).slice(0, 80);

		message.channel.send((emojis.length == 0) ? 'Aucun emoji sur ce serveur' : emojis.join(" ").slice(0, 1900));

	}
};