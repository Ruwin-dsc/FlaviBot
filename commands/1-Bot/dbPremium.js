/**
 * Show premium informations
 */
module.exports = {
	id: 77,
    name: 'dbPremium',
    aliases: ["dbpremium"],
	description: `Permet de changer l'etat du premium d'un serveur.`,
    restricted: true,
    hidden: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

    const embed = client.createEmbed(client.color.blue, message, true)      

        if (!args[0]) {

            const PremiumState = await client.db.query(`SELECT premium FROM guilds WHERE id='${message.guild.id}'`)

                embed.setDescription(`\n:star: **État du premium Serveur :** \nServeur : ${PremiumState.rows[0].premium >= 1 ? "<:Online:696412815363276930> Actif" : "<:Dnd:696412815447031878> Inactif"}`)

            return message.channel.send(embed);

        }

        if (args[0] === "0") {

            client.db.query(`UPDATE guilds SET premium=null WHERE id='${message.guild.id}'`);
                embed.setDescription(`\n:star: **État du premium Serveur :** \nServeur : <:Dnd:696412815447031878> Inactif`)

            return message.channel.send(embed);

		} else if(args[0] === "1") {
                
            client.db.query(`UPDATE guilds SET premium=1 WHERE id='${message.guild.id}'`);

                embed.setDescription(`\n:star: **État du premium Serveur :** \nServeur : <:Online:696412815363276930> Actif`)

            return message.channel.send(embed);
        }


	}
};