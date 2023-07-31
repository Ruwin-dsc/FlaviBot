/**
 * Shows all commands sorted by their category
 */
module.exports = {
    id: 53,
    name: 'help',
    aliases: ['h', 'aide'],
    description: `Permet de voir les commandes du bot`,
    arguments: `<commandName?>`,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {array<string>} args
     */
    async run(client, message, language, args) {

        const allCommands = client.commands.filter(c => !c.hidden && !c.restricted).array();

        // list all commands
        if (args.length == 0) {

            let commands = {};

            allCommands.forEach(cmd => {
                if (!(cmd.category in commands)) {
                    commands[cmd.category] = [];
                }

                commands[cmd.category].push(cmd.name);
            });

            // header embed
            const embed = client.createEmbed(client.color.blue, message, true)
                .setDescription(`${language.COMMAND_HELP["1"].replace("{commands}", client.commands.array().filter(cmd => !cmd.hidden).length)}`);


            // core embed.
            client.categoryOrder.forEach(category => {
                const catCommands = commands[category] ?? [];

                let catName = category[0].toUpperCase() + category.slice(1);

                let isPremium = false;

                if (['Ticket'].includes(catName)) {
                    isPremium = true;
                }


                const n = catCommands.length;

                const squareColor = client.categoryColors[category] ?? client.categoryColors.default;

                const sCommands = catCommands.map(cmd => '`' + cmd + '`').join(', ');


                embed.addField(`${squareColor} **${catName} (${n})**${isPremium ? ' :star:' : ''}`, (sCommands.length == 0) ? '<a:chargement:727228583310917734> En développement...' : sCommands);
            });


            // footer embed
            embed
                .addField(`<:lordhosting:708737756863660082> LordHosting`, `FlaviBot est en partenariat avec **[LordHosting](https://lordhosting.fr/)**`)
                .addField(`:link: Links`, `${language.COMMAND_HELP["2"]}`);

            message.channel.send(embed);
        }




        // details of a given command
        else if (args.length == 1) {
            let cmd = allCommands.filter(cmd => cmd.name === args[0])[0] ?? null;

            const embed = client.createEmbed(client.color.blue, message);

            if (cmd) {
                embed
                    .setTitle(cmd.name)
                    .addFields(
                        { name: `${language.COMMAND_HELP["3"]}`, value: cmd.description ?? `${language.COMMAND_HELP["5"]}` },
                        { name: `${language.COMMAND_HELP["4"]}`, value: cmd.usage }
                    );

                if (cmd.aliases && cmd.aliases.length > 0) {
                    embed.addField('Alias :', cmd.aliases.map(a => `\`${a}\``).join(', '));
                }
            }

            else if (client.aliases.has(args[0])) {
                const alias = client.aliases.get(args[0]);
                cmd = client.commands.get(alias);

                embed
                    .setTitle(cmd.name)
                    .addFields(
                        { name: `${language.COMMAND_HELP["3"]}`, value: cmd.description ?? `${language.COMMAND_HELP["5"]}` },
                        { name: `${language.COMMAND_HELP["4"]}`, value: cmd.usage }
                    );

                if (cmd.aliases && cmd.aliases.length > 0) {
                    embed.addField(`${language.COMMAND_HELP["6"]}`, cmd.aliases.map(a => `\`${a}\``).join(', '));
                }
            }

            else {
                embed.setDescription(`${language.COMMAND_HELP["7"]}`);
            }


            message.channel.send(embed);
        }

    }
};
