const { MessageEmbed } = require('discord.js');

let fGuildNumber, oRegions, fCheckDays;

/**
 * Runs when the bot is removed from a server
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

		// less clean than real require, but we can do dynamic importation
		const { guildNumber, regions, checkDays } = require(`${this.client.root + this.client.config.paths.modules}/utils.js`);
		[fGuildNumber, oRegions, fCheckDays] = [guildNumber, regions, checkDays];

		const owner = await this.client.users.fetch(guild.ownerID);

		const number = await fGuildNumber(this.client);

		// send embed to support server
		const newGuildEmbed = JSON.stringify(new MessageEmbed()
			.setColor(this.client.color.red)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ dynamic: true }) : "https://flavibot.xyz/public/images/noticon.png")
			.setTitle("Serveur quitté !")
			.setDescription(`:x:Malheureusement quelqu'un m'a expulsée sur **${guild.name}**. A cause de toi, je suis sur **${number}** serveurs.` +
				`\n\n<:owner:726428530262671360> **Propriétaire :** \`${owner?.tag}\` (\`${owner?.id}\`)` +
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

	}
}
