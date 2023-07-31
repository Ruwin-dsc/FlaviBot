/**
 * Show the list of servers the Bot belongs to
 */
module.exports = {
	id: 11,
	name: 'server-list',
	aliases: ["sl"],
	description: `Permet de voir la liste des serveurs du bot`,
	hidden: true,
	restricted: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
		];

		Promise.all(promises)
			.then(async results => {

				let i0 = 0;
				let i1 = 10;
				let page = 1;

				const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);

				const description =
					`Serveurs : ${totalGuilds}\n\n` +
					message.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
						.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} `)
						.slice(0, 10)
						.join("\n");

				const embed = client.createEmbed(client.color.blue, message, true)
					.setTitle(`Pages : ${page}**/**${Math.ceil(totalGuilds / 10)}`)
					.setDescription(description);

				let msg = await message.channel.send(embed);

				await msg.react("⬅");
				await msg.react("➡");
				await msg.react("❌");


				const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);


				collector.on("collect", async (reaction, user) => {

					if(reaction._emoji.name === "⬅") {
						// Updates variables
						i0 = i0 - 10;
						i1 = i1 - 10;
						page = page - 1;

						description = `Serveurs : ${totalGuilds}\n\n` +
							message.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
								.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} `)
								.slice(i0, i1)
								.join("\n");

						// Update the embed with new informations
						embed.setTitle(`Pages : ${page}/${Math.round(totalGuilds / 10)}`)
							.setDescription(description);

						// Edit the message 
						msg.edit(embed);
					}

					if(reaction._emoji.name === "➡") {
						// Updates variables
						i0 = i0 + 10;
						i1 = i1 + 10;
						page = page + 1;

						// if there is no guild to display, delete the message

						description = `Serveurs : ${totalGuilds}\n\n` +
							message.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
								.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} `)
								.slice(i0, i1)
								.join("\n");

						// Update the embed with new informations
						embed.setTitle(`Pages :${page}/${Math.round(totalGuilds / 10)}`)
							.setDescription(description);

						// Edit the message 
						msg.edit(embed);
					}

					if(reaction._emoji.name === "❌") {
						return msg.delete();
					}

					// Remove the reaction when the user react to the message
					await reaction.users.remove(message.author.id);

				});

			});
			
	}
};