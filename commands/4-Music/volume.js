/**
 * Change bot's audio volume
 */
module.exports = {
	id: 41,
	name: 'volume',
	aliases: ['vol'],
	description: `Permet de changer le volume de la musique.`,
	arguments: `<volumePercentage>`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		// must be connected to a voice channel
		if(!message.member.voice.channel) {
			message.channel.send(client.resultEmbed(client.color.fail, ':x: Vous devez rejoindre un salon vocal avant de faire la commande'));
		}

		//
		else {

			const { initPlayer, priority } = client.loadModule('player');

			const player = initPlayer(client, message.guild.id);

			// check user priority
			if(priority(client, message) == 0) {
				return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
			}

			// no current music playing
			if(!player.dispatcher) {
				return message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
			}

			const newVolume = args.join('');

			// wrong argument type given
			if(!newVolume || isNaN(newVolume)) {
				return message.channel.send(client.resultEmbed(client.color.purple, `:speaker: Le volume est actuellement à ${player.dispatcher.volume*100}%`));
			}

			// set volume
			player.dispatcher.setVolume(newVolume / 100);

			message.channel.send(client.resultEmbed(client.color.purple, `${this.volumeEmoji(newVolume)} Le volume est maintenant à ${newVolume}%`));
		}

		client.removeModule('player');

	},

	volumeEmoji(volume) {
		if(0 == volume) {
			return ':mute:';
		}

		if(volume < 50) {
			return ':sound:';
		}

		return ':loud_sound:';
	}
};