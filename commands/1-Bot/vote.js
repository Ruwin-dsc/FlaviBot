/**
 * Show vote invitation link
 */
module.exports = {
	id: 16,
    name: 'vote',
    description: `Envoie le lien Top.gg pour donner un vote à ce bot`,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 */
    run(client, message, language, args) {
        
        const embed = client.createEmbed(client.color.blue, message, true)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(`${language.COMMAND_VOTE}\nhttps://top.gg/bot/684773505157431347/vote`)
            .setImage("https://top.gg/api/widget/upvotes/684773505157431347.png?noavatar=true");

        message.channel.send(embed);

    }
};