/**
 * Clear bulk messages
 */
module.exports = {
	id: 22,
	name: 'clear',
	description: `Permet de supprimer des messages`,
	arguments: `<number of deletion>`,
	permissions: ['MANAGE_MESSAGES'],
	userPerms: ['DEV', 'MANAGE_MESSAGES'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const deleteCount = parseInt(args[0]);
		
		// the number of deletion isn't well formed
		if(!deleteCount || deleteCount < 1 || deleteCount > 99 || isNaN(deleteCount)) {
			
			const embed = client.createEmbed(client.color.red, message, message, true)
				.setDescription(`Veuillez indiquer un nombre entre **1** et **99** !`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);

		}

		
		
		
		// delete messages
		else {
			// in DM
			if(message.channel.type == 'dm') {
			
				message.channel.messages.fetch().then(msgs => {
					const botMessages = msgs.filter(msg => msg.author.equals(client.user)).filter(msg => msg !== undefined).array();
					
					let totalDeleted = 0;

					console.log(botMessages.length);

					let i = 0;
					let max = Math.min(deleteCount, botMessages.length);

					while(i < max) {
						if(botMessages[i].deletable) {
							botMessages[i].delete();
							totalDeleted++;
						}

						i++;
					}

					
					let desc = `${totalDeleted} de mes messages ont été effacés / ${deleteCount} demandés.`;
					
					if(totalDeleted != deleteCount) {
						desc += "\nRaisons possibles:\n"
							+ "  - Les messages datent d'au moins 2 semaines.\n"
							+ "  - Une erreur inconnue\n"
							+ "  - Nombre trop grand, dans ce cas réessayer pour effacer les messages manquants";
					}

					desc += '\nCe message se supprimera dans **5s**.';

					const embed = client.createEmbed(client.color.red, message, message, true)
						.setDescription(desc);

					message.channel.send(embed).then(embed => embed.delete({ timeout: 5000 }));
				});

			}

			// in guild
			else {
				message.delete();

				const fetched = await message.channel.messages.fetch({
					limit: deleteCount + 1
				});

				message.channel.bulkDelete(fetched);

				const embed = client.createEmbed(client.color.red, message, message, true)
					.setDescription(`**${deleteCount}** ${(deleteCount===1) ? 'message a été supprimé' : 'messages ont été supprimés'} ! \nLe message se supprimera automatiquement dans **5s** !`);

				message.channel.send(embed).then(embed => embed.delete({ timeout: 5000 }));

			}
		}
	}
};


