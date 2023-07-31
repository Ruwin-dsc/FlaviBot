module.exports = {
    id: 72,
    name: 'whereis',
    description: `Montre les serveurs de l'utilisateur mentionné où le bot y est aussi.`,
    arguments: `<@mention>`,
    restricted: true,
    hidden: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {array<string>} args
     */
    async run(client, message, language, args) {

        if (args.length != 1) {
            message.channel.send(
                client.resultEmbed(client.color.blue)
                    .setDescription('Veuillez préciser un utilisateur discord en le mentionnant ou par son ID Discord.')
                    .addField('Utilisation', this.usage)
            );
        }

        else {

            const user = await client.users.fetch(message.mentions.users.first()?.id) ?? (args[0] ? await client.users.fetch(args[0]) : undefined);

            if (!user) {
                message.channel.send(client.resultEmbed(client.color.fail, `:x: utilisateur introuvable.`));
            }

            else if (user.equals(client.user)) {
                message.channel.send('Haha très marrant ^^');
            }

            else {

                const guilds = client.guilds.cache.filter(async g => await g.members.fetch(user.id) !== undefined).map(g => `• ${g.name}`);

                const desc = (guilds.length > 0) ? guilds.join('\n') : 'Aucun serveur en commun.';

                const embed = client.createEmbed(client.color.blue, message)
                    .setTitle(`Serveurs en communs [${guilds.length}]`)
                    .setDescription(desc);

                message.channel.send(embed);
            }

        }

    }
};