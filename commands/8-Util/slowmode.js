/**
 * Set a slowmode on a channel
 */
module.exports = {
	id: 61,
	name: 'slowmode',
	description: `Permet de mettre un mode-lent sur un salon`,
	arguments: `<interval>`,
	permissions: ['MANAGE_CHANNELS'],
	userPerms: ['DEV', 'ADMINISTRATOR'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);

		let duration = args[0];


		if(!duration || isNaN(duration) || duration < 5 || duration > 21600) {

			if(duration === 'off' || duration === '0') {
				embed.setDescription(`Le slowmode a été désactivé !`);
				message.channel.setRateLimitPerUser('0');
			}

			else {
				embed
					.setDescription(`Veuillez indiquer un temps un temps en seconds ! \n5s | 10s | 15s | 30s | 60s | 120s | 300s | 600s | 900s | 1800s | 3600s | 7200s | 21600s`)
					.addField(`Utilisation :`, `${this.usage}`);
			}
		}

		else {
			embed.setDescription(`Le slowmode a été définis sur **${duration}s** entre chaque message !`);
			message.channel.setRateLimitPerUser(duration);
		}
		
		message.channel.send(embed);

	}
};