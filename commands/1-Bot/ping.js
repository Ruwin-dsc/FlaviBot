/**
 * Show Bot ping & latency
 */
module.exports = {
	id: 8,
	name: 'ping',
	description: `Permet de voir le ping du bot`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const t1 = Date.now();
			await client.db.query("SELECT * FROM guilds");
		const t2 = Date.now();

		let m = await message.channel.send(`<a:Chargement:751776703617040394> Ping en cours...`, true);

		const embed = client.createEmbed(client.color.blue, message, true)
			// .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`\n**${language.COMMAND_PING["1"]}** \`${m.createdTimestamp - message.createdTimestamp}\`ms`+
				`\n**${language.COMMAND_PING["2"]}** \`${client.ws.ping}\`ms`+
				`\n**${language.COMMAND_PING["3"]}** \`${t2 - t1}\`ms`);
			// .addField("Shard Latency", `${client.shard.pings}ms`, true)

		m.edit("", embed);

	}
};




