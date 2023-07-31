/**
 * Roll winners
 */
module.exports = {
	id: 43,
	name: 'greroll',
	description: `Permet de relancer le tirage des gagnants`,
	arguments: `<ID|name>`,
	guildOnly: true,
	disabled: false,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.white, message, true);

		if(!message.member.roles.cache.some(r => r.name === "Giveaways") && !message.member.hasPermission('MANAGE_GUILD') && !client.isDev(message.author.id)) {

			embed.setDescription("Vous n'avez pas la permission de faire `!"+ this.name +"` car vous n'avez pas le rôle `Giveaways`, ou vous n'avez pas la permission `MANAGE_SERVER` !");

			return message.channel.send(embed);

		}

		// must precise which giveaway
		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer un identifiant ou le nom d'un giveaway terminé.`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}


		// try to found the giveaway with prize then with ID
		let giveaway =
			// Search with giveaway prize
			client.giveawaysManager.giveaways.find(g => g.prize === args.join(' ')) ||
			// Search with giveaway ID
			client.giveawaysManager.giveaways.find(g => g.messageID === args[0]);


		// If no giveaway was found
		if(!giveaway) {
			return message.channel.send(client.resultEmbed(client.color.white, `:mag: Giveaway introuvable : \`${args.join(' ')}\``));
		}

		// Reroll the giveaway
		client.giveawaysManager.reroll(giveaway.messageID)
			.then(() => {
				// Success message
				//message.channel.send('');
			})
			.catch(e => {
				if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)) {
					message.channel.send(client.resultEmbed(client.color.white, ":hourglass: Le Giveaway n'est pas encore terminé !"));
				}
				
				else {
					console.error(e);
					message.channel.send(client.resultEmbed(client.color.white, `:x: Une erreur s'est produite...`));
				}
			});

	},
};