const figlet = require("figlet");
const { promisify } = require("util");
const figletAsync = promisify(figlet);

/**
 * Shows given text on ASCII form
 */
module.exports = {
	id: 46,
	name: 'ascii',
	description: `Permet d'écrire un texte en ascii`,
	usage: `<text>`,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		let text = args.join(" ").trim();

		const embed = client.createEmbed(client.color.green, message, true);

		
		if(!text || text.length > 20) {
				embed.setDescription(`Veuillez indiquer une phrase entre 1 à 20 caratères.`);
				embed.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}


		let rendered = await figletAsync(text);

		
		if(text.length > 10) {
			message.channel.send('```' + rendered + '```');	
		} else {
			embed.setDescription("```" + rendered + "```");
			message.channel.send(embed);
		}

	}
}