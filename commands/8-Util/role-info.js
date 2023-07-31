const Canvas = require('canvas');
const { MessageAttachment,MessageEmbed } = require("discord.js");

/**
 * Show role info
 */
module.exports = {
	id: 88,
    name: 'role-info',
    aliases: ['roleinfo', 'ri'],
	arguments: '@role|roleID',
	description: `Permet de voir des informations sur un rôle.`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

        const roleInfo = message.guild.roles.cache.find(x => x.name.toLowerCase().includes(args[0]?.toLowerCase()) || x.id === args[0]) || message.mentions.roles.first()

		if (roleInfo === undefined) {
	
		// member not found
		const embedv = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Rôle introuvable !`)
			.setTimestamp()
			.setFooter(client.footerT(message.guild.id), client.footerI())
	
		return message.channel.send(embedv);
		
        }
        

		const embed = client.createEmbed(client.color.blue, message, true);

		// no argument given
		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer un rôle !`)
				.addField(`Utilisation :`, `${this.usage}`);
        }



        const canvas = Canvas.createCanvas(50, 50);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = roleInfo.hexColor;
        ctx.fillRect(0, 0, 50, 50)

        const attachment = new MessageAttachment(canvas.toBuffer(), "color.png");

        const memberss = await message.guild.members.fetch()

        const membersRole = memberss.filter(u => u.roles.cache.has(roleInfo.id))

        embed
        .attachFiles(attachment)
        .setThumbnail(`attachment://color.png`)
        .setTitle(`Information sur le rôle : ${roleInfo.name}`)
        .setDescription(
            `<a:AutreDroite:749369556992000100> Infos sur le rôle :`+
            `\n\n**Nom :** ${roleInfo}`+
            `\n**Identifiant :** \`${roleInfo.id}\``+
            `\n**Couleur :** \`${roleInfo.hexColor}\``+
            `\n\n${roleInfo.mentionable ? "<:SwitchOn:768948781202145331>" : "<:SwitchOff:768947795276726292>"} Permettre à tout le monde de @mentionner ce rôle.`+
            `\n${roleInfo.hoist ? "<:SwitchOn:768948781202145331>" : "<:SwitchOff:768947795276726292>"} Afficher les membres ayant ce rôle séparément des autres membres en ligne.`+
            `\n\n<a:AutreDroite:749369556992000100> Infos sur les membres ayant le rôle :`+
            `\n\n**Membre${membersRole.size >= 2 ? "s" : ""} ayant le rôle [${membersRole.size}]** `+
            `\n${membersRole.map(u => `\`${u.user.tag}\``).slice(0, 10).join("**, **")} ${membersRole.size > 10 ? `et **${membersRole.size - 10}**` + (membersRole.size - 10 >= 1 ? ` autres membres.` : "autre membre.") : ""}`
            )


		message.channel.send(embed);

	}
};
