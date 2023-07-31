const { MessageEmbed } = require("discord.js");
/**
 * Mute a member
 */
module.exports = {
	id: 25,
	name: 'mute',
	description: `Permet de mute une personne`,
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

		// user not found
		if(!user) {
			embed
				.setDescription(`Veuillez indiquer la personne à Mute !`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		// cannot mute itself
		if(user.id === message.author.id) {
			return message.channel.send(client.resultEmbed(client.color.fail, ":x: Vous ne pouvez pas vous mute vous même."));
		}

		// search muted role
		let role = message.guild.roles.cache.find(c => c.name === "Muted");

		// role does not exist: create it
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

			catch(err) {client.sendError(err, message, true);}
		}
		
		// get the member
		const member = message.guild.members.cache.get(user.id);

		const reason = args.slice(1).join(' ') || `Aucune raison énnoncée. Mute par ${message.author.tag}`;
		
		if (reason.length >= 500) reason.slice(0, 500)


		// already muted
		if(member.roles.cache.has(role.id)) {
			return message.channel.send(client.resultEmbed(client.color.fail, "Cette personne est déjà mute !"));
		}

		if(role && message.guild.members.cache.get(client.user.id).roles.highest.position >= role.position) {
		// add role
		await member.roles.add(role.id);
		
		embed
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`**${user.tag}** vient de se faire Mute ! \n\n__Auteur :__ ** ${message.member}** \n\n__Raison :__ ** ${reason}**`);

		message.channel.send(embed)

			const embed2 = new MessageEmbed()
				.setColor(client.color.success)
				.setDescription(`:white_check_mark: Vous venez de vous faire Mute par \`${message.author.tag}\` sur le serveur **${message.guild.name}** ! \n\n Raison : \`${reason}\``)
			return user.send(embed2).catch(message.channel.send(client.resultEmbed(client.color.fail, `:x: L'utilisateur \`${user.tag}\` vient d'être Mute du serveur mais je n'ai pas pu le lui dire par message privé.`)))




		} else {
			return message.channel.send(client.resultEmbed(client.color.fail, `:x: Mon rôle est en dessous du rôle <@&${role.id}>, il faut que mon rôle soit au dessus.`));
		}

	}
};




