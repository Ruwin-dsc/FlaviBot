/**
 * Join the voice channel the author is in
 */
module.exports = {
	id: 32,
	name: 'join',
	description: `Permet de rejoindre le salon vocal`,
	permissions: ['CONNECT'],
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

		const { initPlayer, priority } = client.loadModule('player');

		const player = initPlayer(client, message.guild.id);

		// check user priority
		if(priority(client, message) == 0) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
		}

		// join voice channel
		player.connection = await message.member.voice.channel.join();
		
		message.channel.send(client.resultEmbed(client.color.success, `:white_check_mark: Je viens de rejoindre le salon vocal.`));

		client.removeModule('player');

	}
};