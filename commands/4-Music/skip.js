/**
 * Skip current song and start the next one
 */
module.exports = {
	id: 39,
	name: 'skip',
	description: `Permet de passer à la musique suivante`,
	guildOnly: true,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const { initPlayer, play, priority } = client.loadModule('player');

		// must be connected to a voice channel
		if(!message.member.voice.channel) {
			message.channel.send(client.resultEmbed(client.color.fail, ':x: Vous devez rejoindre un salon vocal avant de faire la commande'));
		}

		//
		else {
			
			const player = initPlayer(client, message.guild.id);

			// check user priority
			if(priority(client, message) == 0) {
				return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
			}

			// no current music playing
			if(!player.dispatcher) {
				message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
			}

			// skip without looping mode
			else if(player.loop == 'off') {
				player.queue.shift();
				play(client, message);
			}
			
			// skip with looping mode
			else {
				await player.dispatcher.destroy();

				player.index = (player.index + 1) % player.queue.length;

				play(client, message);			
			}

		}

		client.removeModule('player');

	}
};