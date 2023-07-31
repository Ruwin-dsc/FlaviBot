/**
 * Show donation paypal's link
 */
module.exports = {
	id: 87,
    name: 'language',
    aliases: ["langs", "langue", "lang"],
    arguments: `<fr|en|french|english>`,
    description: `Permet de choisir la langue du bot.`,
    userPerms: ['DEV', 'MANAGE_GUILD'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const lang = await client.db.query(`SELECT lang FROM guilds WHERE id='${message.guild.id}'`)
			.then(({rows}) => rows[0])

        if (!args[0]) {
		const embed = client.createEmbed(client.color.orange, message, true)
            .setDescription(
                `:flag_mf: Veuillez chosir une langue.`+
                `\n:flag_us: Please choose a language.`+
                `\n\n**Actuelle / Current :** \`${lang.lang}\``)
            .addField(`Utilisation / Usage:`, `${this.usage}`);
        return message.channel.send(embed)
        }

        // args[0].toLowerCase

        if (["fr", "french"].includes(args[0])) {

        const lang = await client.db.query(`UPDATE guilds set lang='french' WHERE id='${message.guild.id}'`)
            .then(({rows}) => rows[0])

           return message.channel.send(client.resultEmbed(client.color.success, `:white_check_mark: Langue du bot définis sur \`french\``));
        } else

        if (["en", "english"].includes(args[0])) {

            const lang = await client.db.query(`UPDATE guilds set lang='english' WHERE id='${message.guild.id}'`)
                .then(({rows}) => rows[0])

               return  message.channel.send(client.resultEmbed(client.color.success, `:white_check_mark: Bot language set to \`english\``));
        } else {
            message.channel.send(client.resultEmbed(client.color.fail, `:x: Erreur lang non reconnue :(`));
        }


        

	}
};
