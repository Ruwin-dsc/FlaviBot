/**
 * Tell the bot to say what we sent
 */
module.exports = {
	id: 89,
    name: 'addEmoji',
    aliases: ['addemoji', 'addemote'],
	description: `Permet d'ajouter des emojis sur son serveur à partir d'un lien ou d'une image.`,
	arguments: `<nom> <ImageLink|Image>`,
    userPerms: ['DEV', 'MANAGE_EMOJIS'],
    // inDev: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {


		const embed = client.createEmbed(client.color.blue, message, true);

        if (!args[0] || !args[1]) {
            embed
            .setDescription("Vous devez choisir un nom et une image")
            .addField("Utilisation :", `${this.usage}`);
        }
    
        if (args[0] && args[1]) {

            try {

            await message.guild.emojis.create(args[1], args[0]).then(e => {
            
                // console.log(e)
                embed.setDescription(`${e} a été ajouté avec succès !`);

            })

        } catch (error) {
            embed.setDescription(`Erreur`);
        }
        }

			message.channel.send(embed);

    }
};