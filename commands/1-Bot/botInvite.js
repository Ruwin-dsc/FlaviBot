const { MessageEmbed } = require("discord.js");

/**
 * Show donation paypal's link
 */
module.exports = {
	id: 80,
    name: 'botInvite',
    aliases: ["botinvite", "bi"],
    description: `Permet d'obtenir une invite d'un bot`,
    arguments: `@mention || id`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {



        let man = await client.getMember(message, args);


    if (!args[0]) {
        const embed = client.createEmbed(client.color.red, message, message)
        .setDescription(`Veuillez indiquer l'identifiant d'un robot !`)
        .addField(`Utilisation :`, `${this.usage}`);

    return message.channel.send(embed);
    }

    if (!man) {

        // member not found
        const embedv = new MessageEmbed()
            .setColor(client.color.blue)
            .setDescription(`robot introuvable introuvable !`)
            .setTimestamp()
            .setFooter(client.footerT(message.guild.id), client.footerI())
    
        return message.channel.send(embedv);
        
        }

        if (man.bot) {

            if (!args[0].length == 18 || !args[0].length == 17 || !args[0].length == 19) return message.channel.send("Nope")


            const embed = new MessageEmbed()
                .setColor("#77b255")
                .setTitle(`:white_check_mark: Nom : \`${man.tag}\` `)
                .setDescription(`**Permission Admin :** [Cliquez ici](https://discord.com/oauth2/authorize?client_id=${man.id}&scope=bot&permissions=8) pour ajouter le bot !`+
                `\n**Sans permission :** [Cliquez ici](https://discord.com/oauth2/authorize?client_id=${man.id}&scope=bot&permissions=) pour ajouter le bot ! \n\nID : \`${man.id}\``)
            return message.channel.send(embed)
        
        } else {

            return message.channel.send(client.resultEmbed(client.color.red, `:x: identifiant invalide !`))
            
        }
	}
};