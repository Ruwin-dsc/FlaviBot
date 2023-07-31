/**
 * Disconnect the bot from voice channel
 */
module.exports = {
	id: 31,
	name: 'disconnect',
	description: `Permet de quitter le salon vocal`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		// must be connected to a voice channel
		if(!message.member.voice.channel) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Vous devez rejoindre un salon vocal avant de faire la commande`));
		}

		const { priority } = client.loadModule('player');

		// check user priority
		if(priority(client, message) == 0) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
		}

		// leave
		message.member.voice.channel.leave();
		message.channel.send(client.resultEmbed(client.color.success, `:white_check_mark: Déconnection effectuée`));
		
	}
};