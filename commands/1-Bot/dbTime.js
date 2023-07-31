const { MessageEmbed } = require("discord.js");

/**
 * Show donation paypal's link
 */
module.exports = {
	id: 84,
    name: 'dbTime',
    aliases: ["dbtime", "dbt"],
	description: `Affiche le timestamp d'un temps d'une requête basique à la database`,
    hidden: true,
    restricted: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {
        const t1 = Date.now();
            await client.db.query("SELECT * FROM guilds");
        const t2 = Date.now();
        
        message.channel.send(`Database request time spent : ${t2 - t1} ms`);
	}
};