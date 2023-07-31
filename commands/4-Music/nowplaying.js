const { MessageEmbed } = require('discord.js');
const moment = require("moment");

/**
 * Show which music is currently playing
 */
module.exports = {
	id: 34,
	name: 'nowplaying',
	aliases: ["np"],
	description: `Permet de voir la musique en cours`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const { initPlayer } = client.loadModule('player');

		const player = initPlayer(client, message.guild.id);

		// not current music playing
		if(!player.dispatcher) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
		}

		// infos
		const duration = moment.duration({ ms: player.queue[player.index].time });
		const progress = moment.duration({ ms: player.dispatcher.streamTime });

		const secondes = duration.seconds() < 10 ? `0${duration.seconds()}` : duration.seconds();
		const secondes1 = progress.seconds() < 10 ? `0${progress.seconds()}` : progress.seconds();


		const nProgress = 16;
		let progressBar = '▬'.repeat(nProgress).split('');
		
		const calcul = Math.round(nProgress * (player.dispatcher.streamTime / (player.queue[player.index].time)));
		
		progressBar[calcul] = '🔘';


		const npEmbed = new MessageEmbed()
			.setColor(client.color.purple)
			.setTitle('Musique en cours')
			.setDescription(`[${player.queue[player.index].title}](${player.queue[player.index].url})`)
			.setThumbnail(player.queue[player.index].thumbnail)
			.addField('Durée:', '[`' + progress.minutes() + ':' + secondes1 + '`] ' + progressBar.join('') + ' [`' + duration.minutes() + ':' + secondes + '`]');
		
		message.channel.send(npEmbed);

		client.removeModule('player');
	},
};