const Canvas = require('canvas');
const utf8 = require('utf8');
const { MessageAttachment, MessageEmbed } = require('discord.js');

/**
 * Shows the level of a member in a guild
 */
module.exports = {
	id: 91,
    name: 'leaderboard',
    aliases: ["lb"],
	description: `Permet de voir le classement des membres du server en niveau.`,
	arguments: ``,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
            
        return message.channel.send(`Voici le lien pour voir le classement du serveur : \nhttps://flavibot.xyz/leaderboard/${message.guild.id}`);

	}
}