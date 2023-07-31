const { MessageEmbed } = require("discord.js");

/**
 * Show an easter-egg message
 */
module.exports = {
	id: 2,
	name: "easter-eggs",
	hidden: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const embed = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Mais..... c'est... INCROYABLE !!!!! Vous venez de trouver un **Easter Eggs** !!!`);

		await message.channel.send(embed);

		const salon = client.channels.cache.get("748897186745679872")

		const embed2 = new MessageEmbed()
			.setColor(client.color.blue)
			.setDescription(`Mais..... c'est... INCROYABLE !!!!! ${message.author} à trouver un **Easter Eggs** !!!`);

		await salon.send(embed2)

	}
};