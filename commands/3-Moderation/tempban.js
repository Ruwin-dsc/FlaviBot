/**
 * Ban a member for a given moment
 */
module.exports = {
	id: 73,
	name: 'tempban',
	description: `Permet de bannir une personne temporairement`,
	arguments: `@mention <duration> <reason?>`,
	permissions: ['BAN_MEMBERS'],
	userPerms: ['DEV', 'BAN_MEMBERS'],
    guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, true);

		const member = message.guild.member(message.mentions.users.first())?? (args[0]? message.guild.members.cache.get(args[0]) : undefined);

		// member not found
		if(!member) {
			embed
				.setDescription(`Veuillez indiquer la personne à Bannir !`)
				.addField(`Utilisation :`, this.usage);

			return message.channel.send(embed);
		}

		// cannot ban itself
		if(member.id === message.author.id) {
			return message.channel.send(client.resultEmbed(client.color.fail, ":x: Vous ne pouvez pas vous ban vous même."));
		}


		// duration
        let duration = args[1];

		// not well formed duration
        if(!duration || isNaN(duration)) {
            embed
                .setDescription('Veuillez indiquer le temps du ban en jour !')
                .addField('Utilisation :', this.usage);

            return message.channel.send(embed);
        }

		// get it as number - not string
        duration = parseInt(duration);



		// reason
		let reason = args.slice(2).join(" ");

		// no reason states
		if(!reason) {
			reason = `Aucune raison énnoncée. Ban par : ${message.author.tag}`;
		}



        try {
            await client.commands.get('ban')?.run(client, message, [args[0], reason]);
            message.channel.send(`Son ban est fixé à **${duration} jours**`);

            const ms = duration * 24 * 60 * 60 * 1000;

            client.setTimeout(() => {
                client.commands.get('unban')?.run(client, message, [member.id]);
            }, ms);
        }


        catch(e) {

        }


        

	}
};