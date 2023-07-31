const fetch = require("node-fetch");

/**
 * Shows random animal's picture
 */
module.exports = {
	id: 45,
	name: 'animal',
	description: `Affiche une image aléatoire d'un animal`,
	arguments: `<animalName>`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const animals = [
			{names: ['chat', 'cat'], url: "https://api.thecatapi.com/v1/images/search"},
			{names: ['chien', 'dog'], url: "https://dog.ceo/api/breeds/image/random"},
			{names: ['renard', 'fox'], url: "https://randomfox.ca/floof"}
		];

		if(args.length !== 1 || args[0].trim().length === 0) {
			return message.channel.send("Vous devez préciser un animal.\nAnimaux que je peux afficher:\n" + animals.map(a => `\`${a.names[0]}\``).join(', '));
		}

		const arg = args[0].trim();

		const embed = client.createEmbed(client.color.green, message, true);

		

		const animal = animals.find(beast => beast.names.includes(arg));

		const isVowel = l => 'aeiouy'.includes(l);


		if(!animal) {
			embed.setDescription(`Je ne peux pas encore envoyer d'images d${isVowel(arg[0])? "'":"e "}${arg}\nAnimaux disponibles: ${animals.map(a => a.names[0])}`);
			embed.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}


		const animalImage = await fetch(animal.url)
			.then(res => res.json())
			.then(json => json.message?? json.image?? json[0].url)
			.catch(error => console.log(error));


		embed.setDescription(`Voici une image de **${animal.names[0]}** !`);
		embed.setImage(animalImage);


		message.channel.send(embed);


	}
}
