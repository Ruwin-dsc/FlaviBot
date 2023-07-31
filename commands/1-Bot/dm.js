const { MessageEmbed } = require("discord.js");

/**
 * DM a member
 */
module.exports = {
	id: 19,
	name: 'dm',
	description: `Permet d'envoyer un message privé à une personne en passant par le bot`,
	arguments: `<@mention|ID> <message>`,
	restricted: true,
	guildOnly: true,
	
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

		const embed = client.createEmbed(client.color.blue, message, true)


		const messageMP = args.slice(1).join(" ").trim();

		// need the right number of argument
		if(!memberM || !messageMP) {
			embed.setDescription("Veuillez indiquer une personne et un message à envoyer à la personne !");
			embed.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}


			// if it's a bot, don't do anything
			if(memberM.bot) return message.channel.send(client.resultEmbed(client.color.fail, ":x: Les bots ne peuvent pas mp d'autres bots"));

			// need to have a message
			if(messageMP) {
				embed.setDescription(`${messageMP}`);
				
				memberM.send(embed).catch(message.channel.send(client.resultEmbed(client.color.fail, `❌ L'utilisateur \`${memberM.tag}\` a ses message privé désactivés.`)))
				message.channel.send(client.resultEmbed(client.color.success, `✅ Message envoyé !`));
			}
		

	}
};