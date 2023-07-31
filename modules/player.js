const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');


/**
 * @object defaultGuildObject
 * Default music manager's object
 */
module.exports.defaultGuildObject = function() {
	return {
		queue: [],
		index: 0,
		isPlaying: false,
		volume: 0.50,
		type: null,
		dispatcher: false,
		connection: false,
		loop: 'off',
		broadcast: false,
		muteIndicator: false,
		backup: {
			index: null,
			seek: null
		}
	};
};





/**
 * init the player
 * @param {Client} client 
 * @param {Snowflake} guildID 
 * @return {Object}
 */
module.exports.initPlayer = function(client, guildID) {
	// if no guild music manager exists, create one
	if(!client.music[guildID]) {
		client.music[guildID] = module.exports.defaultGuildObject();
	}

	// return guild music manager
	return client.music[guildID];
};






/**
 * Returns the priority of user about the bot
 * @param {Client} client Discord bot's client
 * @param {Message} message message object's of the user
 */
module.exports.priority = function(client, message) {	
	const clientOnGuild = message.guild.members.cache.get(client.user.id);

	// is not on the guild - break
	if(!clientOnGuild) return 1;

	const connected = clientOnGuild.voice.connection;

	// not connected to a voice channel on this guild
	if(!connected) return 1;

	// connected, so check on which voice channel
	const inSameChannel = connected.channel.id == message.member.voice.channel.id;

	// is on the same voice channel than the member that has done the command
	if(inSameChannel) return 1;

	// the client is alone on the voice channel
	if(clientOnGuild.voice?.channel?.members?.size === 1) return 1;


	// don't have the prio
	return 0;
};





/**
 * Save data in backup
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports.heathBeat = function(client, message) {
	const player = module.exports.initPlayer(client, message.guild.id);
	
	player.backup.index = player.index;
	
	if(player.dispatcher) {
		player.backup.seek = player.dispatcher.streamTime;
	}
};






/**
 * check if the user has the permissions necessery
 * @param {Client} client
 * @param {Message} message
 * @param {Boolean}
 */
module.exports.hasPermission = function(client, message) {
	const player = module.exports.initPlayer(client, message.guild.id);

	return (message.member.hasPermission(['ADMINISTRATOR'], { checkAdmin: true, checkOwner: true }))
	|| (message.member.roles.cache.find(role => role.name === 'DJ'))
	|| (!player.dispatcher)
	|| (message.guild.me.voice.channel.members.size < 2);
};






/**
 * Get songs
 * @param {String} query
 * @return {Promise<Object>}
 */
module.exports.getSongs = async (query, youtubeAPI) => {
	return await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&key=${youtubeAPI}&q=${encodeURI(query)}`)
		.then(response => response.data)
		.catch(error => error);
};






/**
 * parse an amount of seconds into hours : minutes : seconds
 * @param {number} seconds 
 */
module.exports.parseSeconds = seconds => {
	const format = val => `0${Math.floor(val)}`.slice(-2);

	const hours = seconds / 3600;
	const minutes = (seconds % 3600) / 60;

	let time = [hours, minutes, seconds % 60].map(format).join(':');

	time = time.replace(/^(00:)+/, '');

	return time;
};






/**
 * Play a song
 * @param {Client} client
 * @param {Message} message 
 * @param {number} seek
 */
module.exports.play = async function(client, message, seek=0) {
	const player = module.exports.initPlayer(client, message.guild.id);

	// no more songs in the queue
	if(!player.queue || player.queue.length < 1) {
		return message.channel.send(client.resultEmbed(client.color.purple, `Il n'y a plus de musique dans la playlist`));
	}

	// queue is not created / finished
	if(!player.queue[player.index]) {
		player.index = player.queue.length;

		if(!player.queue[player.index]) {
			player.index = 0;

			if(!player.queue[player.index]) {
				return message.channel.send(client.resultEmbed(client.color.purple, `Il n'y a pas de musique dans la playlist`));
			}
		}
	}

	// play song
	player.dispatcher = player.connection.play(
		await ytdl(player.queue[player.index].url, {
			filter: 'audioonly',
			quality: 'highestaudio'
		}), {
			volume: player.volume,
			highWaterMark: 20,
			seek
		}
	);

	
	// heatbeat
	const heatBeat = setInterval(() => {
		module.exports.heathBeat(client, message);
	}, 5000);
	

	//
	player.connection.voice.setSelfDeaf(true);
	player.connection.voice.setSelfMute(false);

	//
	player.broadcast = false;


	// display embed of the current playing music
	if(!player.muteIndicator) {
		const playNowEmbed = new MessageEmbed()
			.setColor(client.color.purple)
			.setTitle(`Musique en cours - ${module.exports.parseSeconds(player.queue[player.index].time / 1000)}`)
			.setDescription(player.queue[player.index].title)
			.setThumbnail(player.queue[player.index].thumbnail)
		
		message.channel.send(playNowEmbed);
	}
	
	// else react to tell user the music is playing
	else if(message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
		message.react('👌');
	}


	// when the song has finished
	player.dispatcher.on('finish', async () => {
		clearInterval(heatBeat);

		if(player.dispatcher) {
			player.dispatcher.destroy();
		}

		player.dispatcher = null;

		// no loop
		if(player.loop === 'off' && player.queue.length !== 0) {

			player.queue.shift();

			if(player.queue.length === 0) {
				return module.exports.play(client, message);
			}

			player.index = 0;
			module.exports.play(client, message);

		}
		
		// loop
		else if(player.loop === 'on') {

			if(player.index === player.queue.length - 1) {
				player.index = 0;
			} else {
				player.index++;
			}

			module.exports.play(client, message);

		}
		
		// loop only once
		else if(player.loop === 'once') {
			module.exports.play(client, message);
		}
	});




	let r;

	//
	player.dispatcher.on('speaking', s => {
		if(s === r) return;

		r = s;

		player.isPlaying = r === 1;
	});



	// an error occured
	player.dispatcher.on('error', async err => {
		clearInterval(heatBeat);

		console.error(err);

		message.channel.send(err, { code: 'js' });
		player.index = player.backup.index;

		return module.exports.play(client, message, player.backup.seek / 100);
	});
};







/**
 * Call request
 * @param {Message} message
 * @param {MessageEmbed} embed
 * @param {Object} options
 * @param {String} options.required
 * @param {String} options.complete
 * @param {String} options.content
 * @return {Promise<Boolean>} 
 */
module.exports.callRequest = async (message, embed, options) => {
	return new Promise(async resolve => {
		const m = await message.channel.send(embed);

		const members = message.member.voice.channel.members.filter((m => !m.user.bot));

		if(members.size > 1) {
			if(message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
				m.react('👍');
			}

			const mustVote = Math.floor(members.size / 2 + 1);

			embed.setDescription(options.required.replace(/{{mustVote}}/g, mustVote));

			m.edit(embed);

			const filter = (reaction, user) => {
				let member = message.guild.members.cache.get(user.id);
				let voiceChannel = member.voice.channel;

				return voiceChannel && voiceChannel.id === message.member.voice.channelID;
			};

			let collector = await m.createReactionCollector(filter, {
				time: 25000
			});

			collector.on("collect", (reaction, user) => {
				const haveVoted = reaction.count - 1;

				if(haveVoted >= mustVote) {
					embed.setDescription(options.complete);
					m.edit(embed);
					collector.stop(true);

					resolve(true);
				}
				
				else {
					embed.setDescription(options.content.replace(/{{haveVoted}}/g, haveVoted).replace(/{{mustVote}}/g, mustVote));
					m.edit(embed);
				}
			});

			collector.on("end", (collected, isDone) => {
				if(!isDone) {
					return resolve(false);
				}
			});

		} else {
			resolve(true);
		}
	});
};