const { MessageEmbed, UserFlags } = require("discord.js");
const moment = require('moment');

/**
 * Show user's informations
 */
module.exports = {
	id: 64,
	name: 'user-info',
	aliases: ['userinfo', 'ui'],
	description: `Permet d'avoir des informations sur une personne`,
	arguments: `@mention`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const memberM = await client.getMember(message, args);

		if (!memberM) {
	
		// member not found
		const embedv = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Utilisateur introuvable !`)
			.setTimestamp()
			.setFooter(client.footerT(message.guild.id), client.footerI())
	
		return message.channel.send(embedv);
		
		}

		moment.locale('fr');

		const status = {
			online: "<:Online:696412815363276930> En ligne",
			idle: "<:Idle:696412815354888232> Inactif",
			dnd: "<:Dnd:696412815447031878> Ne pas déranger",
			offline: "<:Offline:696412815367471235> Hors-Ligne",
			streaming: "<:Stream:696412815140978789> Stream"
		};


		let userflags = await memberM.fetchFlags();

		const flags = new UserFlags(userflags.bitfield).serialize();


		let badges = []

		if(flags.DISCORD_EMPLOYEE) badges.push("<:BadgeEquipeDiscord:748898314451288125>");

		if(flags.DISCORD_PARTNER) badges.push("<:BadgeDiscordPartenaire:749370049839759442>");

		if(flags.HYPESQUAD_EVENTS) badges.push("<:BagdeHypeSquadEvents:748898311825522729>");
		
		if(flags.HOUSE_BRAVERY) badges.push("<:BagdeHypeSquadBravery:748898311435714570>");

		if(flags.HOUSE_BRILLIANCE) badges.push("<:BadgeHypeSquadBrillance:748898311968391208> ");

		if(flags.HOUSE_BALANCE) badges.push("<:BagdeHypeSquadBallane:748898310747848735>");
		
		if(flags.BUGHUNTER_LEVEL_2) badges.push("<:BadgeChasseurDeBugGOLD:748898313079619614>");
		
		if(flags.BUGHUNTER_LEVEL_1) badges.push("<:BadgeChasseurDeBug:748898312928886784>");

		if(flags.EARLY_SUPPORTER) badges.push("<:BadgeSoutientPremireHeure:748898319748562974>");

		if(flags.VERIFIED_DEVELOPER) badges.push("<:BadgeDeveloppeurDiscord:748898313696444476>");

		let booster = message.guild.roles.cache.filter(x => x.managed && x.hoist).map(e => e.id)[0]

		let memberG

		try {

			memberG = await message.guild.members.fetch(memberM.id)

		} catch (e) {
			memberG = null
		}

		if (memberM.avatar != null && memberM.avatar.startsWith("a_") || memberG?.roles.cache.has(booster) || memberM.discriminator === "0001") badges.push("<:BadgeNitro:749370249366863902>");

		if (memberG && memberG.roles.cache.has(booster)) badges.push("<:BadgeBooster1Mois:749370297169477674>");

		if(memberM.bot) {
			if(flags.VERIFIED_BOT) badges.push("<:Verified1:725699682923184209><:Verified2:725699670709633114>");
			else badges.push(" <:bot:722859538335924227> ");
		}


		




		const embed2 = client.createEmbed(client.color.blue, message)
			.setAuthor(memberM.username, memberM.displayAvatarURL({ dynamic: true }))
			.setThumbnail(memberM.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`\n<a:AutreDroite:749369556992000100> Infos sur l'utilisateur :\n`+
				
				`\n<:member:726127280203759657> **Pseudonyme :** \`${memberM.tag}\` (\`${memberM.id}\`) ${memberM.bot ? badges : ""}` +
				`${memberM.bot ? "" : `\n<:nitro:726132466083037264> **Badge${(badges.length > 1) ? "s" : ""} :** ${(badges.length > 0) ? badges.map((a) => a).join(" ") : "Aucun badge !"}`}` +
				`\n<:ID:726127280283320442> **Identifiant :** \`${memberM.id}\`` +
				`\n<:friend:726135773723754517> **Compte créé le :** ${moment.utc(memberM.createdAt).format('dddd LL à LT')}` +

				`${memberG ? `\n\n<a:AutreDroite:749369556992000100> Infos sur le membre :\n` +

				`\n<:RCP:726127280220405932> **Activité :** ${memberG.presence.activities[0] ? memberG.presence.activities[0]?.type === "CUSTOM_STATUS" && memberG.presence.activities[0]?.state != null ? memberG.presence.activities[0].state : "Aucune activité." : "Aucune activité."}` +
				`\n<:offline2:726173956062707742>  **Status :** ${status[memberG.presence.status]}` +
				`\n **Surnom :** ${memberG.nickname !== null ? memberG.nickname : "Aucun surnom :("}`+
				`\n<:join:726127280472064071> **À rejoint le serveur le :** ${moment.utc(memberG.joinedAt).format('dddd LL à LT')}`+
				`\n<:role:726132912591863928> **Rôle${memberG.roles.cache.size < 2 ? "" : "s"} [${memberG.roles.cache.size - 1}] :** ${memberG.roles.cache.size < 2 ? "Aucun rôle." : "\n"+memberG.roles.cache.array().filter(r => r.name != '@everyone').slice(0, 10).join("**,** ")} ${memberG.roles.cache.size > 11 ? `et **${memberG.roles.cache.size - 11}** autre${memberG.roles.cache.size - 11 > 1 ? "s" : ""} rôle${memberG.roles.cache.size - 11 > 1 ? "s" : ""}.` : ``}` : ""}`
				)

		message.channel.send(embed2);



	}
};


	
