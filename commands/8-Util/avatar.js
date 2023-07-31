const { MessageEmbed } = require("discord.js");

/**
 * Shows user's avatar
 */
module.exports = {
	id: 47,
	name: 'avatar',
	description: `Permet d'avoir l'avatar d'une personne`,
	arguments: `@mention`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const memberM = await client.getMember(message, args);

	if (!memberM) {

		// member not found
		const embedv = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Utilisateur introuvable !`)
			.setTimestamp()
			.setFooter(client.footerT(message.guild.id), client.footerI())
	
		return message.channel.send(embedv);
		
		}

		const embed = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Avatar de **${memberM.username}**`)
			.setImage(memberM.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setTimestamp()
			.setFooter(client.footerT(message.guild?.id), client.footerI())
		message.channel.send(embed);

	}
};