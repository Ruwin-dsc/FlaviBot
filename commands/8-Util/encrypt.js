const base64 = require('base-64');
const utf8 = require('utf8');

/**
 * Encrypt message
 */
module.exports = {
	id: 52,
	name: "encrypt",
	description: `Permet de crypter un texte`,
	arguments: `<encryptionMethod> <text>`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);


		const methods = {
			base64: bytes => base64.encode(bytes)
		};


		if(!args[0]) {
			embed
				.setDescription(`Veuillez indiquer la méthode de cryptage!`)
				.addField(`Utilisation :`, `${this.usage}`);
		}

		else if(!(args[0] in methods)) {
			embed.setDescription("Je n'utilise pas encore cette méthode.\n**Méthodes disponibles :**```" + Object.keys(methods).join(', ') + "```")
		}

		else if(args[1] && args[1].trim().length > 0) {
			const text = args.slice(1).join(" ");
			
			const bytes = utf8.encode(text);

			const encoded = methods[args[0]](bytes);

			embed.setDescription("Méthode de cryptage : \n" + "`" + args[0] + "`" + ` \n\n${args.slice(1).join(" ")} : ` + "\n`" + encoded + "`");
		}
		
		else {
			embed.setDescription(`Il manque le message à crypter !`);
		}


		message.channel.send(embed);
		
	}
};
