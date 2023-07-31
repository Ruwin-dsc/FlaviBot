/**
 * Shows guild's informations
 */
module.exports = {
	id: 60,
	name: 'server-info',
	aliases: ['serverinfo', 'si'],
	description: `Permet d'avoir des information sur le serveur discord`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const { checkDays, regions } = client.loadModule('utils');
		
		let verifLevels = {
			"NONE": "None",
			"LOW": "Low",
			"MEDIUM": "Medium",
			"HIGH": "(╯°□°）╯︵  ┻━┻",
			"HIGHEST": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
		};

		const members = message.guild.members.cache;

		let online 	= members.filter(m => m.presence.status === 'online').size;
		let dnd		= members.filter(m => m.presence.status === 'dnd').size;
		let idle 	= members.filter(m => m.presence.status === 'idle').size;
		let offline = members.filter(m => m.presence.status === 'offline').size;

		let emojis = message.guild.emojis.cache.array();
		let role = message.guild.roles.cache.array();


		const PremiumState = await client.db.query(`SELECT premium FROM guilds WHERE id='${message.guild.id}'`)

			const owner = await message.guild.members.fetch(message.guild.ownerID).then(o => o.user.tag);
	
			const embed = client.createEmbed(client.color.blue, message, true)
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setDescription(
					`\n<:owner:726428530262671360> **Propriétaire :** ${owner}` +
					`\n<:RCP:726127280220405932> **Nom du serveur :** ${message.guild.name}` +
					`\n:star: **État du premium :** ${PremiumState.rows[0].premium >= 1 ? "<:Online:696412815363276930> Actif" : "<:Dnd:696412815447031878> Inactif"}`+
					`\n<:member:726127280203759657> **Nombre de membres :** ${message.guild.memberCount}` +
					`\n<:channel:726432130942369953> **Nombre de salons :** ${message.guild.channels.cache.size}` +
					`\n<:card:726449270928179250> **Région du serveur :** ${regions[message.guild.region]}` +
					`\n<:IconParametre:749595177554935908> **Niveau de vérification :** ${verifLevels[message.guild.verificationLevel]?? 'Aucun'}` +
					`\n<:ID:726127280283320442> **Identifiant :** ${message.guild.id}` +
					`\n**Status des membres :**` +
					`\n<:Online:696412815363276930> ${online}` +
					`\n<:Idle:696412815354888232> ${idle}` +
					`\n<:Dnd:696412815447031878> ${dnd}` +
					`\n<:Offline:696412815367471235> ${offline}` +
					`\n<:epingle:726127280468000820> **Date de création :** ${message.channel.guild.createdAt.toUTCString().substr(0, 16)}\n${checkDays(message.channel.guild.createdAt)}` +
					`\n<:emojis:726432728152801321> **Émojis [${message.guild.emojis.cache.size}] :** \n${emojis < 1 ? "Ce serveur ne possède aucun émoji." : emojis.slice(0, 13).join("")} ${message.guild.emojis.cache.size > 13 ? `et ${message.guild.emojis.cache.size - 13} autre${message.guild.roles.cache.size - 10 > 1 ? "s" : ""} émoji${message.guild.roles.cache.size - 10 > 1 ? "s" : ""}.` : ``}` +
					`\n<:role:726132912591863928> **Rôles [${message.guild.roles.cache.size - 1}] :** \n${role < 1 ? "Ce serveur ne possède aucun rôle." : role.filter(r => r.name != '@everyone').slice(0, 10).join("**,** ")} ${message.guild.roles.cache.size > 11 ? `et **${message.guild.roles.cache.size - 11}** autre${message.guild.roles.cache.size - 11 > 1 ? "s" : ""} rôle${message.guild.roles.cache.size - 11 > 1 ? "s" : ""}.` : ``}`);

			message.channel.send(embed);

			client.removeModule('utils');
				

	}
};



