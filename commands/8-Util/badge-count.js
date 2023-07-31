const { UserFlags } = require("discord.js");

/**
 * Show user's informations
 */
module.exports = {
	id: 90,
	name: 'badge-count',
	aliases: ['bc'],
	description: `Permet de voir le nombre de badge par type sur le serveur.`,
	arguments: ``,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {


        let badge_DISCORD_EMPLOYEE = 0;
        let badge_DISCORD_PARTNER = 0;
        let badge_HYPESQUAD_EVENTS = 0;
        let badge_HOUSE_BRILLIANCE = 0;
        let badge_HOUSE_BRAVERY = 0;
        let badge_HOUSE_BALANCE = 0;
        let badge_BUGHUNTER_LEVEL_2 = 0;
        let badge_BUGHUNTER_LEVEL_1 = 0;
        let badge_EARLY_SUPPORTER = 0;
        let badge_NITRO = 0;
        let badge_VERIFIED_DEVELOPER = 0;
        let badge_VERIFIED_BOT = 0;
        let badge_NO_VERIFIED_BOT = 0;

        const GuildMembers = await message.guild.members.fetch();

		await GuildMembers.forEach(async m => {
            const userflags = await m.user.fetchFlags();
            
            const flags = new UserFlags(userflags.bitfield).serialize();
            
            if (flags.DISCORD_EMPLOYEE) badge_DISCORD_EMPLOYEE =+ badge_DISCORD_EMPLOYEE + 1;

            if (flags.DISCORD_PARTNER) badge_DISCORD_PARTNER =+ badge_DISCORD_PARTNER + 1;
    
            if (flags.HYPESQUAD_EVENTS) badge_HYPESQUAD_EVENTS =+ badge_HYPESQUAD_EVENTS + 1;
            
            if (flags.HOUSE_BRAVERY) badge_HOUSE_BRAVERY =+ badge_HOUSE_BRAVERY + 1;

            if (flags.HOUSE_BRILLIANCE) badge_HOUSE_BRILLIANCE =+ badge_HOUSE_BRILLIANCE + 1;
    
            if (flags.HOUSE_BALANCE) badge_HOUSE_BALANCE =+ badge_HOUSE_BALANCE + 1;
            
            if (flags.BUGHUNTER_LEVEL_2) badge_BUGHUNTER_LEVEL_2 =+ badge_BUGHUNTER_LEVEL_2 + 1;
            
            if (flags.BUGHUNTER_LEVEL_1) badge_BUGHUNTER_LEVEL_1 =+ badge_BUGHUNTER_LEVEL_1 + 1;
    
            if (flags.EARLY_SUPPORTER) badge_EARLY_SUPPORTER =+ badge_EARLY_SUPPORTER + 1;

            if (m.user.avatar != null && m.user.avatar.startsWith("a_") || m.user.discriminator === "0001") badge_NITRO =+ badge_NITRO + 1;
    
            if (flags.VERIFIED_DEVELOPER) badge_VERIFIED_DEVELOPER =+ badge_VERIFIED_DEVELOPER + 1;

            if (flags.VERIFIED_BOT) { badge_VERIFIED_BOT =+ badge_VERIFIED_BOT + 1 } else if (m.user.bot && !flags.VERIFIED_BOT) { badge_NO_VERIFIED_BOT =+ badge_NO_VERIFIED_BOT + 1 };
            })




		const embed2 = client.createEmbed(client.color.blue, message, true)
			.setDescription(
				`\n<a:AutreDroite:749369556992000100> Infos sur les badges des membres du serveur :\n`+
				`\n<:BadgeEquipeDiscord:748898314451288125> Équipe Discord **${badge_DISCORD_EMPLOYEE}**` +
				`\n<:BadgeDiscordPartenaire:749370049839759442> Partenaire Discord **${badge_DISCORD_PARTNER}**` +
				`\n<:BagdeHypeSquadEvents:748898311825522729> Événements HypeSquad **${badge_HYPESQUAD_EVENTS}**` +
				`\n<:BadgeHypeSquadBrilliance:748898311968391208> Brilliance **${badge_HOUSE_BRILLIANCE}**` +
				`\n<:BagdeHypeSquadBravery:748898311435714570> Bravery **${badge_HOUSE_BRAVERY}**` +
				`\n<:BagdeHypeSquadBallane:748898310747848735> Ballance **${badge_HOUSE_BALANCE}**` +
				`\n<:BadgeChasseurDeBugGOLD:748898313079619614> Chasseur de bugs GOLD **${badge_BUGHUNTER_LEVEL_2}**` +
                `\n<:BadgeChasseurDeBug:748898312928886784> Chasseur de bugs **${badge_BUGHUNTER_LEVEL_1}**` +
                `\n<:BadgeSoutientPremireHeure:748898319748562974> Soutien de la première heure **${badge_EARLY_SUPPORTER}**` +
                `\n<:BadgeNitro:749370249366863902> Nitro **${badge_NITRO}**` +
                `\n<:BadgeDeveloppeurDiscord:748898313696444476> Développeur de bot certifié **${badge_VERIFIED_DEVELOPER}**`+
                `\n<:BadgeBotCertified1:750405832478425180><:BadgeBotCertified2:750405832990130207> Bot vérifié **${badge_VERIFIED_BOT}**` +
                `\n<:BadgeBot:750405832591802409> Bot **${badge_NO_VERIFIED_BOT}**`
				)

		message.channel.send(embed2);



	}
};


	
