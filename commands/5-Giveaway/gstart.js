const ms = require("ms");
const { GiveawaysManager } = require('discord-giveaways');

/**
 * Start a giveaway event
 */
module.exports = {
	id: 44,
	name: 'gstart',
	description: `Permet de mettre en place un Giveaway`,
	arguments: `#channel <duration> <numberofWinners> <reward>`,
	guildOnly: true,
	disabled: false,

	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.white, message, true);

		if(!message.member.roles.cache.some(r => r.name === "Giveaways") && !message.member.hasPermission('MANAGE_GUILD') && !client.isDev(message.author.id)) {

			embed.setDescription("Vous n'avez pas la permission de faire `!"+ this.name +"` car vous n'avez pas le rôle `Giveaways`, ou vous n'avez pas la permission `MANAGE_SERVER` !");

			return message.channel.send(embed);

		}


		const giveawayChannel = message.mentions.channels.first() && args[0];
		const giveawayDuration = args[1];
		const giveawayNumberWinners = args[2];
		const giveawayPrize = args.slice(3).join(' ');





		if(!giveawayChannel || !giveawayDuration || isNaN(ms(giveawayDuration)) || isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0 || !giveawayPrize) {

			embed
				.setDescription(`Veuillez indiquer le salon, le temps, le nombre de gagnant et la récompense ! `)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);

		}

		let salon = message.guild.channels.cache.get(message.mentions.channels.first().id)

		if (salon === undefined || ["category", "voice"].includes(salon.type) || !salon.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
			embed
				.setDescription(`Veuillez régler quelques problème : \nLe bot ne trouve pas le salon ou il ne peut pas envoyer de message dans le salon ${salon}.`)
				return message.channel.send(embed);
		}

		// Start the giveaway
		client.GiveawaysManager.start(salon, {
			// The giveaway duration
			time: ms(giveawayDuration),
			// The giveaway prize
			prize: giveawayPrize,
			// The giveaway winner count
			winnerCount: giveawayNumberWinners,
			// Who hosts this giveaway
			hostedBy: client.config.hostedBy ? message.author : null,
			// Messages
			messages: {
				giveaway: "🎉 **GIVEAWAY** 🎉",
				giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
				timeRemaining: "Temps restant : **{duration}**!",
				inviteToParticipate: "Réagissez avec 🎉 pour participer !",
				winMessage: "Bravo à {winners} ! vous gagnez : **{prize}**!",
				noWinner: "Giveaway annulé.",
				hostedBy: "Hôte : {user}",
				winners: `Gagnant${giveawayNumberWinners > 1 ? "s" : ""}`,
				endedAt: "S'est terminé",
				embedColor: "#4287f5",
				exemptPermissions: [],
				embedFooter: "lol",

				units: {
					seconds: "secondes",
					minutes: "minutes",
					hours: "heures",
					days: "jours",
					pluralS: true
				}
			}
		});

		message.channel.send(client.resultEmbed(client.color.success, `:white_check_mark: Un Giveaway vient de commencer dans ${giveawayChannel} !`));

	}
};