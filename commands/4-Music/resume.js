module.exports = {
	id: 38,
	name: 'resume',
	description: `Permet de reprendre une musique en pause`,
	guildOnly: true,

	async run(client, message, language, args) {

		if(!message.member.voice.channel) {
			return message.channel.send(client.resultEmbed(client.color.fail, 'Vous devez rejoindre un salon vocal avant de faire la commande'));
		}


		const { initPlayer, priority } = client.loadModule('player');

		const player = initPlayer(client, message.guild.id);


		if(priority(client, message) == 0) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
		}


		if(!player.dispatcher) {
			message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
		}

		else {

			player.dispatcher.resume();

			message.channel.send(client.resultEmbed(client.color.purple, `:arrow_forward: Que la musique reprenne !`));
		
		}

		client.removeModule('player');

	}
};