/**
 * Show on which shard the server is
 */
module.exports = {
	id: 12,
	name: 'shard',
	description: `Permet de voir la list des shard de FlaviBot`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		let values = await client.shard.broadcastEval(`
			[
				this.ws.status,
				this.shard.ids,
				this.guilds.cache.size,
				this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
				this.ws.ping,
				Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
				Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
			]
		`);

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
		];

		Promise.all(promises)
			.then(async results => {

				const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
				const totalUsers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
				const RAMmax = values.map(x => x[5]).reduce((prev, ramCount) => prev + ramCount).toFixed(2);
				const shardID = message.guild.shard.id;

				const embed = client.createEmbed(client.color.blue, message, true)
					.setTitle(`${language.COMMAND_SHARD["1"]}`)
					.setDescription(`Total : **${totalGuilds}** serveurs et **${totalUsers}** utilisateurs. Ce serveur est sur le shard \`${shardID}\` \nRAM : \`${RAMmax}MB\` **(32Go Max)**`);

				const statusT = [
					'<:Online:696412815363276930>',//ready
					'Connecting',                 //Connecting
					'<:Idle:696412815354888232>', //Reconnecting
					'<:Idle:696412815354888232>', //Idle
					'Nearly',                     //Nearly
					'<:Dnd:696412815447031878>'   //Disconnected
				];


				values.forEach((value) => {

					const [statusS, shard, serverM, usersM, ping, RAM] = value;



					embed.addField(`${statusT[statusS]} Shard : **${shard}** ${shardID != shard ? "" : " :pushpin:"}`, `Serveurs : \`${serverM}\` \nMembres : \`${usersM}\` \nPing : \`${ping}\`ms \nRAM : \`${RAM}MB\``, true);

				});




				message.channel.send(embed);
			})

			.catch(e => console.log(e));

	}
};
