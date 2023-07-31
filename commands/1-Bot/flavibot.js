const { MessageEmbed } = require("discord.js");

/**
 * Show a flavibot trailer
 */
module.exports = {
    id: 79,
    name: "flavibot",
    description: "Affiche le trailer de FlaviBot",

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {

        // message.channel.send("Testing message.", {
        //     files: [
        //         `${client.root}/trailer.mp4`
        //     ]
        //   });

        message.channel.send('https://www.youtube.com/watch?v=I8WcRqChMJ0&t')


	}
};