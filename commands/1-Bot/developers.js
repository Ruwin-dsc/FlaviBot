const { MessageEmbed } = require('discord.js');

/**
 * Show Bot developers
 */
module.exports = {
    id: 0,
    name: 'developers',
    aliases: ['devs'],
    description: `Montre les développeurs du bot.`, 

    /**
     * @param {Client} client
     * @param {Message} message
     */
	async run(client, message, language, args) {
        const developers = client.developers.map(dev => '`' + client.users.cache.get(dev).tag + '`');

        const embed = new MessageEmbed()
            .setColor(client.color.cyan)
            .setDescription(
                `${language.COMMAND_DEVELOPERS["1"]} **${developers[0]}**`+
                `\n${language.COMMAND_DEVELOPERS["2"]} **${developers.slice(0, 3).join(', ')}**`+
                `\n${language.COMMAND_DEVELOPERS["3"]} **${developers[1]}, ${developers[3]}**`);

        message.channel.send(embed).catch(e => console.error('Command: developers error'));
	}
};


