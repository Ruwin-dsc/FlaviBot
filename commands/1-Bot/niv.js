const { MessageEmbed } = require('discord.js');

/**
 * Lets cheat
 */
module.exports = {
	id: 92,
	name: 'niv',
	description: `Permet de se give des niveaux`,
	arguments: `@mention <Niveaux>`,
    restricted: true,
    hidden: true,

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

		const embed = client.createEmbed(client.color.blue, message, true);

		const niveaux = args[1];

		if(niveaux && Number(niveaux)) {
            
            try {
            const key = `${message.guild.id}-${memberM.id}`;

            client.points.set(key, niveaux, "level");

            embed.setDescription(`${memberM.tag} vient de passer au niveaux ${niveaux} ! \nQuel tricheur celui là !`)
        } catch (err) {
            embed.setDescription(`Rrreur !`)
        }

			message.channel.send(embed);
		}
		
		else if (!memberM || !niveaux) {
			embed
				.setDescription(`Veuillez indiquer une personne ou un niveau !`)
				.addField(`Utilisation :`, `${this.usage}`);

			message.channel.send(embed);
		}

	}
};