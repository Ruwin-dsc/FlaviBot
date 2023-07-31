/**
 * Either show or set maintenance status
 */
module.exports = {
    id: 67,
    name: 'maintenance',
    description: `Change le status du bot s'il est en maintenance ou non.`,
    restricted: true,
    hidden: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {array<string>} args
     */
    async run(client, message, language, args) {

        const is = client.config.maintenance;

        if (args.length == 0) {

            message.channel.send(client.resultEmbed(client.color.cyan, `Je ${is ? '' : 'ne'} suis ${is ? '' : 'pas'} en maintenance.`));
        }


        else {
            const newState = args[0];

            let state = '';

            const possibleStates = [
                ['1', 'true', 'on'],
                ['0', 'false', 'off']
            ];



            // on
            if (possibleStates[0].includes(newState) && !is) {
                state = 'Maintenance activée.';
                client.config.maintenance = true;
                client.user.setActivity("Maintenance en cours...", { type: "WATCHING" });
                client.user.setStatus("dnd");
            }

            // off
            else if (possibleStates[1].includes(newState) && is) {
                state = 'Maintenance désactivée.';
                client.config.maintenance = false;
                client.user.setStatus("online");
            }

            // unknown argument
            else {
                state = 'Mauvais argument donné, ou déjà dans cet état.';
            }


            message.channel.send(client.resultEmbed(client.color.cyan, state))
        }
    }
};