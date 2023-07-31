const math = require("mathjs");

/**
 * Calculate given operation
 */
module.exports = {
	id: 48,
	name: 'calc',
	arguments: '<calculation>',
	description: `Permet de résoudre des opération en Math`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);

		// no argument given
		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer une opération à résoudre !`)
				.addField(`Utilisation :`, `${this.usage}`);
		}

		//
		else {

			try {
				const result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));

				embed
					.addField(`Opération =>`, `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
					.addField(`Résultat =>`, `\`\`\`Js\n${result}\`\`\``);
			}

			catch(e) {
				embed
					.setDescription(`Erreur ! \nOpération impossible à réaliser.`)
					.addField(`Utilisation :`, `${this.usage}`);
			}
		}

		message.channel.send(embed);

	}
};
