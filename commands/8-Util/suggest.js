/**
 * Send suggestion on the guild, with reaction's votes
 */
module.exports = {
	id: 62,
	name: 'suggest',
	description: `Permet d'envoyer une suggestion aux membres du serveur`,
	arguments: `<suggestion>`,
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		let suggestion = args.slice(0).join(" ");

		const embed = client.createEmbed(client.color.blue, message, true);

		if(suggestion) {

			message.delete();

			embed.setDescription(`__Suggestion :__ \n\n${suggestion.trim()}`);

			const channel = message.guild.channels.cache.find(channel => /(idea|suggestion)s?/i.test(channel.name))?? message.channel;

			const msg = await channel.send(embed);

			await msg.react("✅");
			await msg.react("❌");

		} else {

			embed
				.setDescription(`Veuillez indiquer une suggestion !`)
				.addField(`Utilisation :`, `${this.usage}`);

			message.channel.send(embed);

		}

	}
};

