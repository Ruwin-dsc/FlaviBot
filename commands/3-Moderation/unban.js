/**
 * Unban a member
 */
module.exports = {
	id: 27,
	name: 'unban',
	description: `Permet de débannir une personne`,
	arguments: `<ID> <reason?>`,
	permissions: ['BAN_MEMBERS'],
	userPerms: ['DEV', 'BAN_MEMBERS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
		
		const embed = client.createEmbed(client.color.red, message, true);

		// must mention someone
		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer l'iedentifiant de l'utilisateur à débannir !`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		// fetch all bans of the guild
		const bans = await message.guild.fetchBans();

		// fetch the ban of the mentionned member
		const bannedMember = bans.get(args[0]);

		// this member is not banned
		if(!bannedMember) {
			const embed2 = client.createEmbed(client.color.blue, message)
				.setDescription(`Utilisateur introuvable dans la liste des bans !`);

				return message.channel.send(embed2);
		}

		// reason
		let reason = args.slice(1).join(" ").trim();

		// no reason states
		if(reason.length == 0) {
			reason = "Aucune raison fournie.";
		}

		
		// unban the member
		message.guild.members.unban(bannedMember.user.id)
			.then(user => {
				embed
					.setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
					.setDescription(`${bannedMember.user.tag} vient de se faire débannir par ${message.author.tag}`)
					.addField('Raison du ban :', bannedMember.reason?? "Aucune raison fournie.")
					.addField('Raison du unban :', reason);

				message.channel.send(embed);
			})
			.catch(err => {
				client.sendError(err, message, true);
			});

	}
};