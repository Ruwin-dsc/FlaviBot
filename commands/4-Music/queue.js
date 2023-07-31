const { MessageEmbed } = require('discord.js');

/**
 * Show queue
 */
module.exports = {
	id: 37,
	name: 'queue',
	description: `Permet de connaitre la queue des musiques de son serveur`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const { initPlayer, parseSeconds } = client.loadModule('player');

		const player = initPlayer(client, message.guild.id);

		// empty queue
		if(!player.queue || player.queue.length <= 0) {
			message.channel.send(client.resultEmbed(client.color.purple, `La playlist est vide`));
		}
		
		//
		else {

			let totalTime = 0;

			player.queue.forEach(v => totalTime = totalTime + v.time / 1000);

			const queueEmbed = new MessageEmbed()
				.setColor(client.color.purple)
				.setTitle(`**${message.guild.name}** Playlist`)
				.setDescription(player.queue.map((v, i) => `[**${i + 1}**] __${v.title}__ **-** request by ${v.request}`))
				.addField('Temps Playlist', `${parseSeconds(totalTime)}`);
				
			message.channel.send(queueEmbed);

		}

		client.removeModule('player');
	}
};