/**
 * Loop or not loop the queue, that is the question
 */
module.exports = {
	id: 33,
	name: 'loop',
	description: `Permet de jouer en boucle une musique`,
	permissions: ['ADD_REACTIONS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
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

		const arg = args.join('').trim();

		const choices = ['off', 'on', 'once'];
		const reactions = ['➡️', '🔁', '🔂'];

		// well waited argument type
		if(choices.includes(arg)) {
			player.loop = arg;
			message.react(reactions(choices.indexOf(arg)));
		}

		//
		else {
			const i = (choices.indexOf(player.loop) + 1) % choices.length;
			player.loop = choices[i];
			message.react(reactions[i]);
		}


		client.removeModule('player');

	}
};