const pm2 = require('pm2');

/**
 * Restart the Bot
 */
module.exports = {
	id: 10,
	name: 'restart',
	restricted: true,
	hidden: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		try {

			const embed = client.createEmbed(client.color.blue, message, true)
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription("Le bot redémarre !");
				
			console.log(`Le bot redémarre ! (!restart par ${message.author.username}, id: ${message.author.id})`);
			
			await message.channel.send(embed);
			
			await client.db.disconnect();


			await pm2.restart(2);


		}
		
		catch(e) {

			const errorEmbed = client.errorEmbed(e);

			message.channel.send(errorEmbed);

		}

	}
};

