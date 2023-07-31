/**
 * Kick a member
 */
module.exports = {
	id: 24,
	name: 'kick',
	description: `Permet de kick une personne`,
	arguments: `@mention <reason?>`,
	permissions: ['KICK_MEMBERS'],
	userPerms: ['DEV', 'KICK_MEMBERS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, true);

		const memberM = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

		// member does not exist
		if (!memberM) {
			embed
				.setDescription(language.COMMAND_KICK["1"])
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		// cannot kick itself
		if (memberM.id === message.author.id) {
			return message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_KICK["2"]));
		}

		const reason = args.slice(1).join(' ') || `${language.COMMAND_KICK["3"]} ${message.author.tag}`;

		if (reason.length >= 500) reason.slice(0, 500)



		// cannot kick the member
		if (!memberM.kickable) {
			return message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_KICK["4"]));
		}

		// can kick the member

		memberM.kick({ reason: reason })

			.then(() => {

				embed
					.setThumbnail(memberM.user.displayAvatarURL({ dynamic: true }))
					.setDescription(language.COMMAND_KICK["5"]
						.replace("{memberKicked}", memberM.user.tag)
						.replace("{guildName}", message.guild.name)
						.replace("{kickAuthor}", message.member)
						.replace("{reason}", reason)
					);

				return message.channel.send(embed);

			}).catch(err => client.sendError(err, message, true));

	}
};


