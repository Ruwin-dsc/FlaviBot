const { MessageEmbed } = require("discord.js");

/**
 * Warn a member
 */
module.exports = {
	id: 29,
	name: 'warn',
	description: `Permet de bannir une personne pendant un temps précisé.`,
	arguments: `@mention <reason?>`,
	permissions: ['MANAGE_MESSAGES'],
	userPerms: ['DEV', 'MANAGE_MESSAGES'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, true);

		// clear warns or show infos about member's warns
		if(['clear', 'info'].includes(args[1])) {

			// clear warns
			if(args[1] === "clear") {

				const warnUser = message.mentions.users.first();

				// add user warn's object in the enmap of the guild
				client.warn.ensure(`${message.guild.id}-${warnUser.id}`, {
					warn: 0
				});

				// must precise who's warned
				if(!warnUser) {
					const embed2 = client.createEmbed(client.color.red, message)
						.setDescription(`Veuillez indiquer la personne à laquelle enlever ses Warns !`)
						.addField(`Utilisation :`, `${this.usage}`);

					return message.channel.send(embed2);
				}

				// remove all warns of the member
				client.warn.set(`${message.guild.id}-${warnUser.id}`, 0, "warnings");

				//message.reply(`Les warn de : ${warnUser} ont bien été supprimés !`);

				const embed2 = new MessageEmbed()
					.setColor(client.color.red)
					.setThumbnail(warnUser.displayAvatarURL())
					//.setFooter(message.member.displayName, message.author.displayAvatarURL())
					.setTimestamp()
					.setDescription(`**> suppression de warn:** ${warnUser} (${message.guild.id}-${warnUser.id})
						**> unWarn par:** ${message.member} (${message.member.id})
						**> Nombre de warn:** ${client.warn.get(`${message.guild.id}-${warnUser.id}`, "warnings")}
					`);

				message.channel.send(embed2);

			}
			
			// show infos
			else {
				const member = message.guild.member(message.mentions.users.first());

				// member does not exist in the guild
				if(!member) {
					const embed2 = client.createEmbed(client.color.red, message)
						.setDescription(`Veuillez indiquer un membre du serveur !`)
						.addField(`Utilisation :`, `${this.usage}`);

					return message.channel.send(embed2);
				}

				const embed2 = new MessageEmbed()
					.setColor(client.color.red)
					.setThumbnail(member.user.displayAvatarURL())
					.setFooter(message.member.displayName, message.author.displayAvatarURL())
					.setTimestamp()
					.setDescription(`**> Information des warn d'un utilisateur :** ${member} (${member.id})
            			**> Nombre de warn:** ${client.warn.get(`${message.guild.id}-${member.id}`, "warnings")}`);

				message.channel.send(embed2);
			}

		}
		

		else {
			try {
				const warnUser = message.mentions.users.first();

				// user does not exist
				if(!warnUser) {
					embed
						.setDescription(`Veuillez indiquer la personne à Warn !`)
						.addField(`Utilisation :`, `${this.usage}`);

					return message.channel.send(embed);
				}

				// cannot warn itself
				if(warnUser.id === message.author.id) {
					return message.channel.send("Vous ne pouvez pas vous warn !");
				}

				const warnToAdd = 1;

				// reason
				let reason = args.slice(1).join(" ");

				// no reason states
				if(!reason) {
					reason = "Aucune raison fournie !";
				}

				// ensure the user has warn row in the enmap
				await client.warn.ensure(`${message.guild.id}-${warnUser.id}`, {
					warn: 0
				});


				// add warn
				let userWarnings = client.warn.get(`${message.guild.id}-${warnUser.id}`, "warnings");
				userWarnings += warnToAdd;


				await client.warn.set(`${message.guild.id}-${warnUser.id}`, userWarnings, "warnings", reason, "pk");

				let warnNumber = client.warn.get(`${message.guild.id}-${warnUser.id}`, "warnings");
				
				if(isNaN(warnNumber)) {
					warnNumber = 0;
				}

				embed
					.setThumbnail(warnUser.displayAvatarURL({ dynamic: true }))
					.setDescription(`**${warnUser.tag}** vient de se faire Warn ! \n\n__Auteur :__ ** ${message.member}** \n\n__Raison :__ ** ${reason}** \n\n__Nombre de warn :__ **${warnNumber}**`);

				return message.channel.send(embed);

			} catch(e) {
				console.log(e);
			}
		}

	}
};