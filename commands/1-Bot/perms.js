const { MessageEmbed } = require("discord.js");

/**
 * Show Bot permissions on the guild
 */
module.exports = {
	id: 7,
	name: 'perms',
	description: `Permet de voir les permissions dont dispose le bot sur votre serveur`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {

		const perm = {
			true: "<:Online:696412815363276930>",
			false: "<:Dnd:696412815447031878>"
		};


		const hasGneral = permission => {
			return perm[message.guild.me.hasPermission(permission)];
		};
		const hasChannel = permission => {
			return perm[message.channel.permissionsFor(message.guild.me).has(permission)];
		};

		const embed = new MessageEmbed()
			.setColor(client.color.blue)
			.setTitle('Mes permissions sur ce serveur')
			.setDescription(`
				**__Permission générales__**
				${hasGneral("ADMINISTRATOR")} Administrateur.
				${hasGneral("VIEW_AUDIT_LOG")} Voir les logs du serveur.
				${hasGneral("MANAGE_GUILD")} Gérer le serveur.
				${hasChannel("MANAGE_ROLES")} Gérer les rôles.
				${hasChannel("MANAGE_CHANNELS")} Gérer les salons.
				${hasGneral("KICK_MEMBERS")} Expulser des membres.
				${hasGneral("BAN_MEMBERS")} Bannir des membres.
				${hasChannel("CREATE_INSTANT_INVITE")} Créer une invitation.
				${hasChannel("CHANGE_NICKNAME")} Changer le pseudo.
				${hasChannel("MANAGE_NICKNAMES")} Gérer les pseudos.
				${hasGneral("MANAGE_EMOJIS")} Gérer les émojis.
				${hasChannel("MANAGE_WEBHOOKS")} Gérer les webhooks.
				${hasChannel("VIEW_CHANNEL")} Voir les salons.

				**__Permission textuelles__**
				${hasChannel("SEND_MESSAGES")} Envoyer des messages.
				${hasChannel("SEND_TTS_MESSAGES")} Envoyer des messages TTS.
				${hasChannel("MANAGE_MESSAGES")} Gérer les messages
				${hasChannel("EMBED_LINKS")} Intégrer des liens.
				${hasChannel("ATTACH_FILES")} Attacher des fichiers.
				${hasChannel("READ_MESSAGE_HISTORY")} Voir les anciens messages.
				${hasChannel("MENTION_EVERYONE")} Mentionner @everyone, @here et tous les rôles.
				${hasChannel("USE_EXTERNAL_EMOJIS")} Utiliser des émojis externes.
				${hasChannel("ADD_REACTIONS")} Ajouter des réactions.

				**__Permissions vocales__**
				${hasChannel("CONNECT")} Se connecter.
				${hasChannel("SPEAK")} Parler.
				${hasChannel("STREAM")} Vidéo / stream.
				${hasChannel("MUTE_MEMBERS")} Couper le micro de membres.
				${hasChannel("DEAFEN_MEMBERS")} Mettre en sourdine des membres.
				${hasChannel("MOVE_MEMBERS")} Déplacer des membres.
				${hasChannel("USE_VAD")} Utiliser la détection de voix.
				${hasChannel("PRIORITY_SPEAKER")} Voix prioritaire.
			`);

		message.channel.send(embed);
	},
};