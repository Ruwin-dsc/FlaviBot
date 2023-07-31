/**
 * Delete queue and disconnect the bot from voice channel
 */
module.exports = {
	id: 30,
	name: 'destroy',
	description: `Permet de supprimer la queue ainsi que la musique en cours`,
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
		

		const { initPlayer, defaultGuildObject, priority } = client.loadModule('player');

		const player = initPlayer(client, message.guild.id);

		// check member priority
		if(priority(client, message) == 0) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
		}

		// no current music playing
		if(!player.dispatcher) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
		}

		// destroy
		player.dispatcher.destroy();

		message.channel.send(client.resultEmbed(client.color.success, ':white_check_mark: Playlist effacée'));

		// leave
		message.member.voice.channel.leave();

		// delete queue
		client.music[message.guild.id] = defaultGuildObject();

		client.removeModule('player');

	}
};