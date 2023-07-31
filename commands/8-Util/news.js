/**
 * Shows last news
 */
module.exports = {
	id: 56,
	name: 'news',
	description: `Permet de suivre l'actualité concernant le bot`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true)
			.setTitle(`📰 News`)
			.setDescription(`
**Patch Note**
<:Online:696412815363276930>__**Nouvelles commandes:**__
> - Ajout de la commande \`!join\` qui permet au bot de rejoindre le salon vocal.
> - Ajout de la commande \`!ascii\` qui permet d'écrire en ascii.
> - Ajout de la commande \`!gstart\` pour lancer un giveaway.
> - Ajout de la commande \`!gend\` pour finir un giveaway avant sa date de fin.
> - Ajout de la commande \`!greroll\` pour choisir un nouveau gagnant aléatoirement.
> - Ajout de la commande \`!checkip\` pour voir si le serveur à la quelle l'ip est asocié est en ligne.
> - Ajout de la commande \`!nick\` pour changer le pseudo d'un utilisateur sur le serveur.

:arrows_counterclockwise:__**Mise à jour commandes:**__
> - Refonte de la comande \`!level\` la carte à completement été refaite.
> - Changement de permission pour la commande \`!mp\` il faut désormais la permission ADMINISTRATOR.

<a:Loading:708746375621247087>__**Prochainement**__
> - Commande \`!tempban\` pour bannir un membre temporairement.
> - Commande \`!tempmute\` pour mute un membre temporairement.
> - Le panel pour modifier les messages de bienvenue, autorole arrive bientot.
> - Les commandes personalisées arrivent bientôt. :)
\n\nActualisé le 25/06/2020 à 11h48.`);

		message.channel.send(embed);

	}
};