/**
 * Change the prefix of the bot in the server
 */
module.exports = {
	id: 74,
	name: 'prefix',
	arguments: '<nouveauPrefixe>',
	description: `Permet de changer le prefixe du bot sur votre serveur.`,
	userPerms: ['DEV', 'MANAGE_GUILD'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const prefixe = client.prefixes[message.guild.id];

		const now = Date.now();

		// if never used before
		if (!(message.guild.id in this.cooldown)) {
			this.cooldown[message.guild.id] = 0;
		}

		// can use it
		if (now - this.cooldown[message.guild.id] >= this.cooldownDuration) {
			let newPrefix = args[0];

			if (!newPrefix || newPrefix.trim().length === 0) {

				const embed = client.createEmbed(client.color.orange, message, true)
					.setDescription(`${language.COMMAND_PREFIX["1"]
						.replace("{actualPrefix}", prefixe)
						}`)
					.addField(language.USAGE, `${this.usage}`);
				return message.channel.send(embed)

			}

			else {
				newPrefix = newPrefix.trim();

				if (newPrefix.length > this.maxPrefixLengthAuthorized) {
					message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_PREFIX["2"].replace("{maxPrefixSize}", this.maxPrefixLengthAuthorized)));
				}

				else {
					this.cooldown[message.guild.id] = now;

					client.db.query(`UPDATE guilds SET prefix=$1 WHERE id=$2`, [newPrefix, message.guild.id])
						.then(res => {
							prefixe = newPrefix;
							message.channel.send(client.resultEmbed(client.color.success, language.COMMAND_PREFIX["3"].replace("{newPrefix}", newPrefix)));
						})
						.catch(error => {
							console.log(error);
							message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_ERROR));
						});

				}
			}
		}

		// cooldown timing - avoid spams
		else {
			const timeLeft = Math.round((now - this.cooldown[message.guild.id]) / 100) / 10;

			message.channel.send(client.resultEmbed(client.color.fail, language.COMMAND_PREFIX["4"].replace("{timeLeft}", timeLeft)));
		}
	},

	maxPrefixLengthAuthorized: 3,

	cooldownDuration: 2000,

	cooldown: {}
};