const base64 = require('base-64');
const utf8 = require('utf8');

/**
 * Decrypt message
 */
module.exports = {
	id: 50,
	name: "decrypt",
	description: `Permet de décrypter un texte`,
	arguments: `<decryptionMethod> <text>`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);


		const methods = {
			base64: text => base64.decode(text)
		};


		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer la méthode de décryptage!`)
				.addField(`Utilisation :`, `${this.usage}`);
		}

		else if(!(args[0] in methods)) {
			embed.setDescription("Je n'utilise pas encore cette méthode.\n**Méthodes disponibles :**```" + Object.keys(methods).join(', ') + "```")
		}

		else if(args[1] && args[1].trim().length > 0) {
			const text = args.slice(1).join(" ");
			
			const bytes = methods[args[0]](text);

			const decoded = utf8.decode(bytes);

			embed.setDescription("Méthode de décryptage : \n" + "`" + args[0] + "`" + ` \n\n${args.slice(1).join(" ")} : ` + "\n`" + decoded + "`");
		}
		
		else {
			embed.setDescription(`Il manque le message à décrypter !`);
		}

		message.channel.send(embed);

	}
};
