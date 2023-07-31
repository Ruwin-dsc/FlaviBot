const { MessageEmbed } = require('discord.js');

let fGuildNumber, oRegions, fCheckDays;

/**
 * Runs when the bot is added in a new Server
 * @class
 */
module.exports = class {

	/**
	 * @constructor
	 * @param {Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Handles event when occurs
	 * @param {Guild} guild
	 */
	async run(guild) {

		this.client.prefixes[guild.id] = this.client.prefix;

		// less clean than real require, but we can do dynamic importation
		const { guildNumber, regions, checkDays } = require(`${this.client.root + this.client.config.paths.modules}/utils.js`);
		[fGuildNumber, oRegions, fCheckDays] = [guildNumber, regions, checkDays];

		// add guild to the database
		this.client.db.query(`SELECT * FROM guilds WHERE id=$1`, [guild.id])
			.then(({ rows }) => {
				if (rows.length === 0) {
					const id = guild.id;
					const name = guild.name;

					const keys = `id, name, message_wlcm, message_dm_wlcm, message_leave, wlcm_channel_id, leave_channel_id, etat_autorole, etat_msg_wlcm, etat_msg_leave, etat_dm_wlcm, prefix, premium, id_autorole, etat_msg_lvl, lvl_channel_id, message_lvl`;
					const values = `$1, $2, null, null, null, null, null, false, false, false, false, null, 0, null, false, null, null`;

					const request = `INSERT INTO guilds(${keys}) VALUES (${values})`;

					this.client.db.query(request, [id, name])
						.catch(err => this.client.sendError(err, 'guildCreate'));
				}
			})
			.catch(err => this.client.sendError(err, 'guildCreate'));

		const owner = await guild.members.fetch(guild.ownerID);

		const number = await fGuildNumber(this.client);

		// send embed to prevent people on support server
		const newGuildEmbed = JSON.stringify(new MessageEmbed()
			.setColor(this.client.color.blue)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ dynamic: true }) : "https://flavibot.xyz/public/images/noticon.png")
			.setTitle("Nouveau serveur !")
			.setDescription(`:white_check_mark:Merci de m'avoir ajouté sur **${guild.name}**. Grâce à toi, je suis sur **${number}** serveurs.\nMerci` +
				`\n\n<:owner:726428530262671360> **Propriétaire :** \`${owner.user.tag}\` (\`${owner.user.id}\`)` +
				`\n<:RCP:726127280220405932> **Nom du serveur :** \`${guild.name}\`` +
				`\n<:member:726127280203759657> **Nombre de membres :** ${guild.memberCount}` +
				`\n<:channel:726432130942369953> **Nombre de salons :** ${guild.channels.cache.size}` +
				`\n<:card:726449270928179250> **Région du serveur :** ${oRegions[guild.region]}` +
				`\n<:ID:726127280283320442> **Identifiant :** ${guild.id}` +
				`\n<:epingle:726127280468000820> **Date de création :** ${guild.createdAt.toUTCString().substr(0, 16) + checkDays(guild.createdAt)}`)
			.setTimestamp()
			.setFooter(this.client.footerT(guild.id), this.client.footerI())
		);



		this.client.shard.broadcastEval(`
			let channel = this.channels.cache.get('${this.client._channels_.serverLogs}');
			if(channel) channel.send({ embed: ${newGuildEmbed}});
		`);


		// send embed to the new server
		const embed = new MessageEmbed()
			.setColor(this.client.color.blue)
			.setAuthor(guild.owner.user.username, guild.owner.user.displayAvatarURL())
			.setTitle(`(Désolé du message) \nMerci de m'avoir ajouté sur **${guild.name}**`)
			.setDescription(`Bonjour/Bonsoir je suis **FlaviBot**, mon prefix est \`${this.client.prefix}\`. Pour commencer, tapez \`${this.client.prefix}help\` pour avoir la liste des commandes disponibles. Si vous avez des questions ou si vous trouvez un bug, venez sur le [serveur du support](https://discord.gg/rBvf3zP).` +
				`\n\nN'hésitez pas à donner votre avis avec \`${this.client.prefix}feedback\` et à voter avec \`${this.client.prefix}vote\`. \nSi vous avez besoin d'aide, rejoignez le serveur du support ou faites la commande \`${this.client.prefix}support-server\`.`)
			.setFooter(this.client.footerT(guild.id), this.client.footerI());


		const channels = guild.channels.cache.filter(x => x.type === 'text' && x.permissionsFor(guild.me).has('SEND_MESSAGES'));

		const c = channels.find(x => /(general|discussion|global)/.test(x.name.replace(/é|è/, 'e'))) ?? channels.first();

		await c.send(embed);
		await c.send("https://discord.gg/zJyE39J");

		// create an invitation link and send it to staff on support server
		const c2 = c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE') ? c : channels.find(x => x.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));

		await c2.createInvite({ maxAge: 0 })
			.then(code => this.client.wh.logsDiscord.send(`https://discord.gg/${code.code}`).catch(e => console.error('guildCreate WebHook error'))).catch(err => this.client.sendError(err, 'guildCreate'));

	}
}
