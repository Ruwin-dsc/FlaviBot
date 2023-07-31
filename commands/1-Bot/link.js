const { MessageEmbed } = require('discord.js');

/**
 * Show Bot links
 */
module.exports = {
    id: 75,
    name: 'link',
    description: `Montre les liens en rapport avec FlaviBot..`, 

    /**
     * @param {Client} client
     * @param {Message} message
     */
	async run(client, message, language, args) {
        const embede = new MessageEmbed()
            .setColor(client.color.cyan)
            .setTitle(`:link: Links`)
            .setDescription(`${language.COMMAND_HELP["2"]}`);

        message.channel.send(embede).catch(e => console.error('Command: Links error'));
	}
};