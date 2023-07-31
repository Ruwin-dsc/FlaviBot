const ytdl = require('ytdl-core');
const htmlEntitiesDecoder = require('html-entities-decoder');
const { MessageCollector, MessageEmbed } = require('discord.js');

/**
 * Play given music or add it to the queue
 */
module.exports = {
	id: 36,
	name: 'play',
	description: `Permet de jouer de la musique`,
	arguments: `<title|url>`,
	permissions: ['CONNECT'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		// must connect to a voice channel
		if(!message.member.voice.channel) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Vous devez rejoindre un salon vocal avant de faire la commande`));
		}
		

		const Player = client.loadModule('player');

		const player = Player.initPlayer(client, message.guild.id);

		// check user priority
		if(Player.priority(client, message) == 0) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Désolé, le bot est déjà utilisé par quelqu'un d'autre.`));
		}

		
		// get voice channel
		player.connection = await message.member.voice.channel.join();

		// title of song
		const title = args.join('');

		// must precise a title
		if(!title) {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Veuillez indiquer le titre d'une musique`));
		}

		// URL ?
		if(/^http(s)?:\/\/(www\.)?((youtube\.com\/watch)|(youtu\.be\/))/.test(title)) {
			this.readMusic(client, message, Player, player, title);
		}
		
		// search title
		else {
			this.chooseMusicInList(client, message, Player, player, title);
		}

		client.removeModule('player');

	},



	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {module} Player
	 * @param {Object} player
	 * @param {string} url
	 */
	async playSongWithUrl(client, message, Player, player, url) {
		const msg = await message.channel.send(client.resultEmbed(client.color.purple, '<a:chargement:727228583310917734> Chargement de la musique...'));

		let infos = null;

		// try recover video's informations
		try {
			info = await ytdl.getBasicInfo(url);
		} catch(error) {
			const errorEmbed = new MessageEmbed()
				.setColor(client.color.purple)
				.setTitle('Error')
				.setDescription(':x: Je ne peux pas lire ce format de vidéo\n(sûrement une playlist ou un live)');

			console.log(error);

			return message.channel.send(errorEmbed);
		}

		// set video's data as we want
		const video = {
			url: url,
			author: info.author,
			title: info.title,
			description: info.description,
			time: info.length_seconds * 1000,
			likes: info.likes,
			dislikes: info.dislikes,
			request: message.member,
			thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[0].url
		};

		// add it to the queue
		player.queue.push(video);
		player.type = 'player';

		// existing queue or first music ? (so play it right now)
		if(player.queue.length > 1) {
			let allTime = 0;

			player.queue.forEach(v => allTime = allTime + v.time / 1000);

			const addQueueEmbed = new MessageEmbed()
				.setColor(client.color.purple)
				.setTitle(`Musique ajoutée à la playlist`)
				.setDescription(video.title)
				.addFields(
					{ name: 'Song time', value: `${Player.parseSeconds(video.time / 1000)}`, inline: true },
					{ name: 'Playlist time', value: `${Player.parseSeconds(allTime)}`, inline: true },
				)
				.setThumbnail(video.thumbnail);
			
			message.channel.send({ embed: addQueueEmbed }).then(() => msg.delete());

			if(!player.dispatcher) {
				Player.play(client, message);
			}

		} else {
			if(player.queue.length <= 1) {
				player.index = 0;
			}

			await Player.play(client, message);

			msg.delete();
		}

	},



	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {module} Player
	 * @param {Object} player
	 * @param {string} url
	 */
	async readMusic(client, message, Player, player, url) {
		message.suppressEmbeds();

		// check valid url
		if(ytdl.validateURL(url)) {
			const id = await ytdl.getURLVideoID(url);

			this.playSongWithUrl(client, message, Player, player, url);
		}

		else {
			const embed = new MessageEmbed()
				.setColor(client.color.fail)
				.setTitle('Error')
				.setDescription("L'URL n'est pas acceptée.");

			message.channel.send(embed);
		}
	},


	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {module} Player
	 * @param {Object} player
	 * @param {string} title
	 */
	async chooseMusicInList(client, message, Player, player, title) {
		// recover the songs
		const youtube = await Player.getSongs(title, client.config.youtubeAPI);
		
		// ERRORS
		if(youtube.error) {
			client.removeModule('player');
			return message.channel.send(youtube.error.message, { code: 'js' });
		}
		
		if(youtube.isAxiosError) {
			client.removeModule('player');
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Erreur API Youtube: ${youtube.response.status}`));
		}
		//
		
		for(const key in youtube.items) {
			youtube.items[key].snippet.title = htmlEntitiesDecoder(youtube.items[key].snippet.title);
		}

		const listEmbed = new MessageEmbed()
			.setColor(client.color.purple)
			.setTitle(`Liste des musiques`)
			.setDescription(youtube.items.map((v, i) => `[**${i + 1}**] ${v.snippet.title}`).join('\n') + `\n\nEnvoyez \`cancel\` pour annuler la selection.`)
			.setTimestamp()
			.setFooter(client.footerT(message.guild.id), client.footerI());


		message.channel.send(listEmbed).then(msg => {

			const filter = msg => msg.author.id === message.author.id;

			const collector = new MessageCollector(message.channel, filter, {
				time: 20000
			});

			collector.on('collect', async msgCollected => {
				const choice = msgCollected.content.trim().split()[0];

				if(choice.toLowerCase() === 'cancel') {
					client.removeModule('player');
					return collector.stop('STOPPED');
				}

				if(!choice || isNaN(choice)) {
					client.removeModule('player');
					return message.channel.send(client.resultEmbed(client.color.fail, `:x: Votre choix est invalide`));
				}

				if(choice > youtube.items.length || choice <= 0) {
					client.removeModule('player');
					return message.channel.send(client.resultEmbed(client.color.fail, `:x: Ce choix n\'est pas dans la liste`));
				}

				const song = youtube.items[choice - 1];
								
				collector.stop('PLAY');

				const canManage = message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES");

				if(canManage) msg.delete();
				if(canManage) msgCollected.delete();

				if(song.id.kind === 'youtube#channel') {
					client.removeModule('player');
					return message.channel.send(client.resultEmbed(client.color.fail, `:x: Musique avec channel impossible à lire`));
				}

				//
				const videoUrl = `https://www.youtube.com/watch?v=${song.id.videoId}`;
				
				this.playSongWithUrl(client, message, Player, player, videoUrl);
				return;
				
			});

			collector.on('end', (collected, reason) => {
				if(reason === 'STOPPED') {
					return message.channel.send(client.resultEmbed(client.color.success, ':white_check_mark: Vous avez annulé la selection'));
				}
				
				else if(reason === 'PLAY') {
					return false;
				}
				
				else {
					return message.channel.send(client.resultEmbed(client.color.fail, ':x: Vous n\'avez pas choisis de musique à temps'));
				}
			});

		});
	}
};