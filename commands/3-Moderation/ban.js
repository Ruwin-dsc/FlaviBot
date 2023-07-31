/**
 * Ban a member
 */
module.exports = {
	id: 21,
	name: 'ban',
	description: `Permet de bannir une personne`,
	arguments: `@mention <reason?>`,
	permissions: ['BAN_MEMBERS'],
	userPerms: ['DEV', 'BAN_MEMBERS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, message);

		const memberM = message.guild.member(message.mentions.users.first()) ?? (args[0] ? message.guild.members.cache.get(args[0]) : undefined);

		// member does not exist
		if (!memberM) {
			embed
				.setDescription(language.COMMAND_BAN["1"])
				.addField(language.USAGE, `${this.usage}`);

			return message.channel.send(embed);
		}

		// cannot ban itself
		if (memberM.id === message.author.id) {
			return message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_BAN["2"]));
		}

		const reason = args.slice(1).join(' ') || `${language.COMMAND_BAN["3"]} ${message.author.tag}`;

		if (reason.length >= 500) reason.slice(0, 500)

		// cannot ban this member
		if (!memberM.bannable) {
			return message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_BAN["4"]));
		}

		// can ban him

		memberM.ban({
			reason: reason
		})

			.then(() => {
				embed
					.setThumbnail(memberM.user.displayAvatarURL({ dynamic: true }))
					.setDescription(language.COMMAND_BAN["5"]
						.replace("{memberBanned}", memberM.user.tag)
						.replace("{guildName}", message.guild.name)
						.replace("{banAuthor}", message.member)
						.replace("{reason}", reason)
					);

				return message.channel.send(embed);
			}).catch(err => client.sendError(err, message, true));

	}
};