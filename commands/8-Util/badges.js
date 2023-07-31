/**
 * Show donation paypal's link
 */
module.exports = {
	id: 81,
	name: 'badges',
	description: `Permet de voir tout les badges disponible sur Discord`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {
		const embed = client.createEmbed(client.color.blue, message, true)
			.addFields(
                { name: '<:DiscordStaff:696412815292104734> Discord Employer', value: 'Employé chez Discord – [Voir les offres d’emploi](https://discord.com/jobs)' },
                { name: `<:DiscordPartner:748866675956514908> Partner`, value: `Partenaire Discord – [Postuler](https://discord.com/partners)` },
                { name: `<:HypeSquad:720966506191519854> HypeSquad Events`, value: `Ambassadeur Discord – [Postuler](https://discord.com/hypesquad)` },
                { name: `<a:DiscordHypeSquad:748867275557175358> HypeSquad Online`,  value: `S’obtient avec l’onglet HypeSquad dans les paramètres utilisateurs.` },
                { name: `<:BugHunter2:725642039311466577> Bug Hunter Gold`, value: `Membre ayant le rôle **Bug Terminator** sur le serveur [DTesters](https://discord.gg/discord-testers).` },
                { name: `<:BugHunter:696412815279521882> Bug Hunter`, value: `Membre ayant le rôle **Bug Tracker** sur le serveur [DTesters](https://discord.gg/discord-testers).` },
                { name: `<:Developer:698564410180108339> Verified Bot Developer`, value: `Utilisateur membre d’une team de développement ayant un bot certifié.` },
                { name: `<:SupportDiscord:720966506179067934> Early Supporter`, value: `Abonné à Nitro avant le 10 Octobre 2018.` },
                { name: `<:Nitro:720966506242113596> Nitro`, value: `Abonné Nitro ou Nitro Classic – [Voir les avantages](https://discord.com/nitro)` },
				{ name: `<:Boost1month:736533768608808990>  Nitro Boost`, value: `S’obtient en boostant un serveur, évolue dans le temps` },
				{ name: `Crédit`, value: `Cette embed vient tout droit de [DiscordFR](https://discord.gg/fr)`},
                )
		
		message.channel.send(embed).catch(e => console.error('Command: badge error'));
	}
};