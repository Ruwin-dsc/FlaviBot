const t = require("tiktok-stats");

/**
 * Show donation tiktok's user account
 */
module.exports = {
	id: 85,
	name: 'tiktok',
    description: `Permet de voir des stats sur le compte tiktok d'une personne`,
    arguments: `<nom du compte>`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {		

        let tiktokAccount = args[0]
        
    if (tiktokAccount) {
        let m = await message.channel.send(client.resultEmbed(client.color.blue, `<a:Chargement:751776703617040394> Chargement en cours...`));

        const stats = await new t.Stats(tiktokAccount).getStats();

        console.log(stats)

            const embed = client.createEmbed("#EE1D52", message, true)
                .setTitle(`Profil tiktok de ${stats.user.profileName}`) 
                .setColor()
                .setDescription(`
                    **Nom d'utilisateur**: ${stats.user.profileName}
                    **Description**: ${stats.user.description}
                    `)
                .addField("Stats", `
                        **Abonnement** : ${stats.stats.following}
                        **Abonné**: ${stats.stats.follower}
                        **Like**: ${stats.stats.like}
                        **Vidéos**: ${stats.stats.videoCount}
                    `)
                .setThumbnail(stats.user.avatar)
                .setTimestamp()
                return m.edit(embed);

    } else {
        const embed = client.createEmbed(client.color.red, message, message)
            .setDescription(`Veuillez indiquer le nom d'un compte tiktok à rechercher !`)
            .addField(`Utilisation :`, `${this.usage}`)

        return message.channel.send(embed);
    }

	}
};