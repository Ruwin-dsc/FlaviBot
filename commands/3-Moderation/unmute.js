/**
 * Unmute a member
 */
module.exports = {
	id: 28,
	name: 'unmute',
	description: `Permet d'unmute une personne.`,
	arguments: `@mention <reason?>`,
	permissions: ['MUTE_MEMBERS'],
	userPerms: ['DEV', 'MUTE_MEMBERS'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
		
		const embed = client.createEmbed(client.color.red, message, true);

		const user = message.mentions.users.first();

		// user does not exist
		if(!user) {
			embed
				.setDescription(`Veuillez indiquer la personne à Unmute !`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		// cannot unmute itself
		if(user.id === message.author.id) {
			return message.channel.send(client.resultEmbed(client.color.fail, ":x: Comment pourriez-vous ?"));
		}

		// find the role "Muted"
		let role = message.guild.roles.cache.find(c => c.name === "Muted");

		// if the role does not exist, create it
		if(!role) {
			try {
				await message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#000000',
						position: message.guild.roles.cache.size - 2
					}
				});

				role = message.guild.roles.cache.find(c => c.name === "Muted");
			}

			catch(err) {client.sendError(err, true);}
		}
		
		// get the member object of the user in the guild
		const member = message.guild.members.cache.get(user.id);

		// reason
		let reason = args.slice(1).join(' ').trim();

		// no reason states
		if(reason.length == 0) {
			reason = 'Aucune raison.';
		}

		// this isn't muted
		if(!member.roles.cache.has(role.id)) {
			return message.channel.send(client.resultEmbed(client.color.fail, "Cette personne n'est pas mute !"));
		}

		// remove the muted role
		await member.roles.remove(role.id);
		
		embed
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`**${user.tag}** vient de se faire Unmute ! \n\n__Auteur :__ ** ${message.member}** \n\n__Raison :__ ** ${reason}**`);

		message.channel.send(embed);

	}
};