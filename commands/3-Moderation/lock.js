/**
 * Lock a channel
 */
module.exports = {
    id: 94,
    name: 'lock',
    description: `Permet de changer la permission envoyer des messages du everyone`,
    arguments: `on|off`,
    permissions: ['MANAGE_ROLES'],
    userPerms: ['DEV', 'MANAGE_MESSAGES'],
    guildOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {array<string>} args
     */
    async run(client, message, language, args) {


        const everyoneR = message.guild.roles.everyone;

        const ar = everyoneR.permissions.toArray();

    if (everyoneR.editable) {

            if (!['on', 'off'].includes(args[0])) {

                let lock = true;

                const index = ar.indexOf("SEND_MESSAGES")
                if (index > -1) { lock = false }

                const embed = client.createEmbed(client.color.red, message, true)
                    .setDescription(
                        `Veuillez indiquer un argument !` +
                        `\n\nActuellement les salons ${lock ? "`sont vérouillés`" : "`ne sont pas vérouillés`"} !`)
                    .addField(`Utilisation :`, `\`${client.prefixes[message.guild.id]}lock on|off\``)

                return message.channel.send(embed);

            } else if (args[0] === "on") {

                const index = ar.indexOf("SEND_MESSAGES")
                if (index > -1) { ar.splice(index, 1) }

                await everyoneR.edit({ permissions: ar })

                return message.channel.send(client.resultEmbed(client.color.fail, ":lock: Salons vérouillés !"));

            } else if (args[0] === "off") {


                ar.push("SEND_MESSAGES")

                await everyoneR.edit({ permissions: ar })

                return message.channel.send(client.resultEmbed(client.color.success, ":unlock: Salons dévérouillés !"));

            }

        } else {
            return message.channel.send(client.resultEmbed(client.color.fail, ":x: Je ne peux pas modifier le rôle @everyone"));
        }

    }
};