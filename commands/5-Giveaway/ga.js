const ms = require("ms");

/**
 * Start a giveaway event
 */
module.exports = {
	id: 83,
	name: 'ga',
	description: `Permet de mettre en place un Giveaway`,
	arguments: `#channel <duration> <numberofWinners> <reward>`,
	guildOnly: true,
    hidden: true,
    restricted: true,

	async run(client, message, language, args) {
        const embed = client.createEmbed(client.color.white, message, true);

		if(!message.member.roles.cache.some(r => r.name === "Giveaways") && !message.member.hasPermission('MANAGE_GUILD') && !client.isDev(message.author.id)) {
			embed.setDescription("Vous n'avez pas la permission de faire `!"+ this.name +"` car vous n'avez pas le rôle `Giveaways`, ou vous n'avez pas la permission `MANAGE_SERVER` !");
			return message.channel.send(embed);
		}


		const giveawayChannel = message.mentions.channels.first();
		const giveawayDuration = args[1];
		const giveawayNumberWinners = args[2];
        const giveawayPrize = args.slice(3).join(' ');
        

		if(!giveawayChannel || !giveawayDuration || isNaN(ms(giveawayDuration)) || isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0 || !giveawayPrize) {
			embed
				.setDescription(`Veuillez indiquer le salon, le temps, le nombre de gagnant et la récompense ! `)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		let channel = message.guild.channels.cache.get(giveawayChannel.id);

		if(!channel) {
			embed.setDescription(`Le salon n'a pas été trouvé :(`);
			return message.channel.send(embed);
        }
        
        embed.setDescription("ok");

        

        message.channel.send(embed);
    },




    createGiveAwayMessage(client, message, giveaway) {

    },


    createGiveAwayRow(client, message, giveaway) {

    }
};