/**
 * Pause the music
 */
module.exports = {
	id: 35,
	name: 'pause',
	description: `Permet de mettre en pause la musique`,
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
		

		// no current music playing
		if(!player.dispatcher) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
		}
		
		// pause
		player.dispatcher.pause();

		message.channel.send(client.resultEmbed(client.color.purple, `:pause_button: Musique mise en pause`));

		client.removeModule('player');

	}
};