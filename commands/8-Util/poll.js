const Canvas = require('canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');

/**
 * Create a poll
 */
module.exports = {
	id: 68,
	name: 'poll',
	description: `Créé un sondage à réponses multiples`,
	arguments: `"question" "answer1" "answer2" ... | "stop|end"`,
	permissions: ['ADD_REACTIONS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
		const id = message.author.id;

		// show usage
		if (args.length == 0) {
			this.showUsage(client, message);
		}

		// stop the poll
		else if (args.length == 1) {

			if (['end', 'stop'].includes(args[0])) {
				this.stopPoll(client, message, id);
			}

		}

		// show usage
		else if (args.length == 2) {
			this.showUsage(client, message);
		}

		// create poll
		else {
			// already has a poll
			if (client.polls.has(id) && client.polls.has(id, message.guild.id) && !client.polls.get(id, message.guild.id).hasEnded) {
				message.channel.send(client.resultEmbed(client.color.fail, ":x: Vous avez déjà un sondage en cours."));
			}

			// create his poll
			else {
				this.createPoll(client, message, language, args);
			}

		}
	},



	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	showUsage(client, message) {
		const embed = client.createEmbed(client.color.blue, message, true)
			.setDescription(`Veuillez écrire une question et au moins 2 réponses (${this.maxAnswers} max), ou "stop" si vous souhaitez arrêter votre sondage`)
			.addField('Utilisation :', this.usage);

		message.channel.send(embed);
	},




	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {<string>} id
	 */
	stopPoll(client, message, id) {
		// stop his poll
		if (client.polls.has(id) && client.polls.has(id, message.guild.id)) {
			if (client.polls.get(id, message.guild.id).hasEnded) {
				message.channel.send(client.resultEmbed(client.color.fail, ":x: Votre sondage est déjà terminé."));
			}

			else {
				this.getResults(client, message)
					.then(data => this.shareResults(client, message, data))
					.catch(e => {
						client.sendError(e, 'poll');
						client.polls.delete(id, message.guild.id);
					});
			}
		}

		else {
			message.channel.send(client.resultEmbed(client.color.fail, ":x: Vous n'avez pas de sondage en cours."));
		}
	},


	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async getResults(client, message) {
		return new Promise(async (resolve, reject) => {
			// poll of the user
			const poll = client.polls.get(message.author.id, message.guild.id);

			const channel = message.guild.channels.cache.get(poll.channelId);

			if (!channel) {
				message.channel.send(client.resultEmbed(client.color.fail, ":x: Le channel où il y a votre sondage est introuvable.\nJe supprime Donc votre sondage."));
				return reject(channel);
			}

			const msgs = await channel.messages.fetch();


			// recover the embed message
			const msg = msgs.get(poll.messageId);

			// removed message
			if (!msg) {
				message.channel.send(client.resultEmbed(client.color.fail, ":x: L'embed du sondage a été supprimé, je ne peux pas voir les résultats.\nJe supprime donc votre sondage."));
				return reject(msg);
			}


			// reactions
			const reactions = msg.reactions.cache.map(r => {
				return {
					name: r.emoji.name,
					count: r.count - 1,
					users: r.users.cache.filter(u => !u.equals(client.user))
				};
			}).filter(r => this.letters.includes(r.name) || r.name === '✅');

			// total sum reactions
			const totalReactions = reactions.filter(r => this.letters.includes(r.name)).reduce(((acc, r) => acc + r.count), 0);


			const results = [];

			// for each reactions, get their percentage, count etc...
			reactions.forEach(reaction => {
				const idx = this.letters.indexOf(reaction.name);

				if (idx !== -1) {
					let perc = Math.round(reaction.count * 100 / totalReactions * 10) / 10;

					if (isNaN(perc)) {
						perc = 0;
					}

					results[idx] = {
						emoji: reaction.name,
						answer: poll.answers[idx],
						count: reaction.count,
						percentage: perc
					};
				}
			});

			const subscribers = reactions.find(r => r.name === '✅').users.filter(user => user.id !== message.author.id);

			return resolve({
				results: results,
				msg: msg,
				totalReactions,
				subscribers
			})
		});
	},


	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<object>} results
	 * @param {Message} msg
	 * @param {number} totalReactions
	 * @param {array<GuildMember>} subscribers
	 */
	shareResults(client, message, { results, msg, totalReactions, subscribers }) {
		// poll of the user
		const poll = client.polls.get(message.author.id, message.guild.id);

		// editable: change state
		if (msg.editable) {
			const embed = msg.embeds[0]; // recover the embed

			embed.fields[1].value = poll.answers.map((r, i) => `• ${r} \`(${results[i].percentage}%)\``).join('\n');

			embed
				.setColor(client.color.fail)
				.setTitle('Sondage fini !');

			msg.reactions.removeAll();
			msg.edit('', { embed });
		}

		const resultCanvas = this.resultCanvas(message.author.tag, results, totalReactions);

		const attachment = new MessageAttachment(resultCanvas.toBuffer(), `results-poll-${message.author.id}.png`);

		const linkToPoll = `https://discordapp.com/channels/${message.guild.id}/${poll.channelId}/${poll.messageId}`;

		const text = `Voici les résultats du sondage de ${message.author.tag}.\n`
			+ `**Lien vers le sondage : ${linkToPoll}\n`
			+ `**Question :**\n\t"${poll.question}"\n`
			+ `**Réponses :**\n${poll.answers.map((a, i) => `\t• :regional_indicator_${String.fromCharCode(97 + i)}: "${a}" \`${results[i].count} votes (${results[i].percentage}%)\``).join('\n')}`;


		// send results to the author of the poll
		message.author.send(text, attachment).then(() => {
			// set poll as finished
			client.polls.set(message.author.id, true, `${message.guild.id}.hasEnded`);
			message.channel.send(client.resultEmbed(client.color.success, ":white_check_mark: Votre sondage vient de se terminer."));
		}).catch(error => {
			client.sendError(error, message);
			message.channel.send(client.resultEmbed(client.color.fail, ":x: Un problème est survenu."));
		});

		// send results to everyone that react the "follow results" reaction
		subscribers.each(sub => {
			sub.send(text, attachment).catch(e => { });
		});
	},



	/**
	 * @param {string} author
	 * @param {array<object>} results
	 * @param {number} totalReactions
	 */
	resultCanvas(author, results, totalReactions) {
		const n = results.length;

		const headerHeight = 170;
		const footerHeight = 100;

		const barHeight = 50;
		const barMargin = 30;

		const canvas = Canvas.createCanvas(1080, headerHeight + n * (barHeight + barMargin) + footerHeight + 25);
		const ctx = canvas.getContext('2d');

		ctx.font = '40px discord';

		// background - white
		ctx.fillStyle = '#23272A';
		ctx.fillRect(0, 0, canvas.width, canvas.height);



		// header
		ctx.textAlign = 'center';
		ctx.fillStyle = '#fff';

		ctx.fillText(`Résultats du sondage de`, canvas.width / 2, 60);

		ctx.fillStyle = '#007fff';
		ctx.font = '24px discord';

		ctx.fillText(author, canvas.width / 2, 110);


		// graph base
		ctx.fillStyle = '#555';
		ctx.fillRect(100, headerHeight, 4, canvas.height - headerHeight - footerHeight);
		ctx.fillRect(100, canvas.height - footerHeight, canvas.width - 200, 4);

		const maxCountPerc = Math.max(...results.map(r => r.percentage));

		// answers
		results.forEach((answer, i) => {
			const y = headerHeight + 50 + i * (barHeight + barMargin) - barHeight / 2;
			const width = (answer.percentage * 100 / maxCountPerc) * (canvas.width - 204) / 100;

			ctx.fillStyle = this.barColors[i];
			ctx.fillRect(104, y, width, barHeight);

			ctx.fillStyle = '#b9bbbe';
			ctx.fillText(String.fromCharCode(65 + i), 50, y + 34);

			ctx.fillStyle = '#fff';
			ctx.textAlign = 'center';
			ctx.fillText(answer.count, (answer.count == 0) ? 120 : width / 2 + 100, y + 34)
		});


		// footer
		ctx.fillStyle = '#b9bbbe';

		// min
		ctx.fillText('0', 100, canvas.height - footerHeight / 2);

		// max
		if (totalReactions > 0) {
			ctx.fillText(Math.max(...results.map(r => r.count)), canvas.width - 100, canvas.height - footerHeight / 2);
		}


		return canvas;
	},




	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	createPoll(client, message, language, args) {
		// does not have a poll container : create it
		client.polls.ensure(message.author.id, {});

		// if the user has already done a poll before but it ended, remove it
		if (client.polls.has(message.author.id, message.guild.id)) {
			client.polls.delete(message.author.id, message.guild.id);
		}

		args = args.join(' ').trim();

		const arguments = this.formatRequest(args);

		if (3 <= arguments.length && arguments.length <= this.maxAnswers + 1) {

			let channelToSend = message.guild.channels.cache.find(channel => /sondage|poll|survey|questionnaire/.test(channel.name)) ?? message.channel;


			if (!channelToSend.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channelToSend.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
				channelToSend = message.channel;
			}

			message.delete().catch(e => { });


			if (channelToSend.id != message.channel.id) {
				message.channel.send(client.resultEmbed(client.color.blue, `:bar_chart: ${message.author.tag}, votre sondage a bien été créé et vient d'être envoyé dans ${channelToSend}.`));
			}

			const embed = new MessageEmbed()
				.setColor(client.color.blue)
				.setTitle('Nouveau sondage !')
				.setAuthor(`par ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`Réagissez avec :white_check_mark: pour que je vous envoie les résultats en DM.`)
				.addField('Question :', arguments[0])
				.addField('Réponses possibles :', arguments.slice(1).map((r, i) => `• :regional_indicator_${String.fromCharCode(97 + i)}: ${r}`).join('\n'))
				.setTimestamp();

			channelToSend.send(embed).then(async msg => {
				const n = arguments.slice(1).length;

				await msg.react('✅');

				// for the number of answers
				for (let i = 0; i < n; i++) {
					// react with letter
					const emoji = this.letters[i];

					await msg.react(emoji);
				}

				this.savePoll(client, message, arguments, channelToSend.id, msg.id);
			});
		}

		else {
			this.showUsage(client, message);
		}
	},


	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 * @param {string} channelId
	 * @param {string} pollMessageId
	 */
	savePoll(client, message, language, args, channelId, pollMessageId) {
		client.polls.set(message.author.id, {
			author: {
				id: message.author.id,
				tag: message.author.tag
			},
			question: args[0],
			answers: args.slice(1),
			createdAt: Date.now(),
			hasEnded: false,
			channelId: channelId,
			messageId: pollMessageId
		}, message.guild.id);
	},





	/**
	 * @param {string} message
	 */
	formatRequest(message) {
		// remove early and end spaces
		message = message.trim();

		// remove multiple spaces
		message = message.replace(/\s+/g, ' ');

		// remove line breaks for the next instructions
		message = message.replace('\n', ' ');

		// remove spaces between quotes and other chars
		message = message.replace(/(?!")(.)\s+"/g, '$1"').replace(/"\s+(?!")(.)/g, '"$1');

		// transform "strings" separator from space to line break
		message = message.replace(/" "/g, '"\n"');


		// split the string where there're line breaks
		let arrayMessage = message.split('\n');

		// remove every quotes
		arrayMessage = arrayMessage.map(a => a.replace(/"/g, ''));

		if (arrayMessage.join('').trim() === '') return [];

		return arrayMessage;
	},


	letters: ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'],
	maxAnswers: 8,
	barColors: [
		'#68d4cd', // cyan
		'#cff67b', // light green
		'#fd8080', // red
		'#94dafb', // light blue
		'#26e7a6', // green / blue
		'#febc3b', // orange
		'#fab1b2', // rose
		'#8b75d7', // violet
	]
};

