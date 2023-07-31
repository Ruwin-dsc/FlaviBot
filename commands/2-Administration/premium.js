/**
 * Show premium informations
 */
module.exports = {
	id: 70,
	name: 'premium',
	description: `Permet d'obtenir des informations sur le premium.`,
	guildOnly: true,
	inDev: false,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
		
		const PremiumState = await client.db.query(`SELECT premium FROM guilds WHERE id='${message.guild.id}'`)
			.then(({rows}) => rows[0].premium >= 1 ? "<:Online:696412815363276930> Actif" : "<:Dnd:696412815447031878> Inactif")

		const PremiumUsers = await client.db.query(`SELECT COUNT(*) FROM guilds WHERE premium >= 1`)
			.then(({rows}) => parseInt(rows[0].count))

		const embed = client.createEmbed(client.color.blue, message, true)
				.setDescription(
					`Total de serveur Premium : \`${PremiumUsers} ⭐\``+
					`\n\n:star: **État du premium Serveur :** \nServeur : ${PremiumState}`+
					`${PremiumState === "<:Online:696412815363276930> Actif" ? `\nTemps restant : \`4 Jours\`` : ""}`+
					// `\n\n:star: **État du premium Compte :** \nCompte : ${PremiumState} \n Serveur : \`1/2\` \nTemps restant : \`25 Jours\``+
					`\n\n${PremiumState === "<:Online:696412815363276930> Actif" ? "" : "Vous voulez le Premium ? \nRendez vous sur [flavibot.xyz/premium](https://flavibot.xyz/premium)"}`)

				message.channel.send(embed);

	}
};
