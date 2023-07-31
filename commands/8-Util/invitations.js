const { MessageEmbed } = require("discord.js");

/**
 * Show invitations created by the member on the guild
 */
module.exports = {
	id: 5,
	name: 'invitations',
	description: `Permet de voir le nombre d'invitation(s) d'une personne`,
	permissions: ['MANAGE_GUILD'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const getInvites = async user => {
			let invites = await message.guild.fetchInvites().catch(error => console.log(error));

			let memberInvites = invites.array().filter(i => i.inviter && i.inviter.id === user.id);

			let content = memberInvites.join('\n') || "Aucun lien d'invitation";
			let index = 0;


			memberInvites.forEach(invite => index += invite.uses);


			if(memberInvites.size <= 0) {
				index = 0;
			}


			let embed = client.createEmbed(client.color.green, message, true)
				.addField("__Vous avez :__", `**${index}** invite${index > 1 ? "s" : ""}.`)
				.addField(`__Lien${content >= 1 ? "s" : ""} utilisé${content > 1 ? "s" : ""} :__`, content);

			return message.channel.send(embed);
		};






		if(!args[0]) {
			getInvites(message.author);
		}

		else {

			const member = message.mentions.users.first() || client.users.cache.get(args[0]);

			if(member !== undefined) {
				getInvites(member);
			}

			
			else {
				const embed = new MessageEmbed()
					.setColor(client.color.blue)
					.setDescription(`Utilisateur introuvable !`);

				return message.channel.send(embed);
			}

		}

	}
};