const translate = require("@k3rn31p4nic/google-translate-api");

/**
 * Translate messages from a lang to another
 */
module.exports = {
	id: 63,
    name: 'translate',
    description: `Permet de traduire un message`,
    arguments: `<from?> <to> <text> | "langs-list"`,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    async run(client, message, language, args) {

        const { langs } = client.loadModule('utils');

        const embed = client.createEmbed(client.color.blue, message, true);


        if(!args[0]) {
            embed
				.setDescription(`Veuillez indiquer un langage source, un langage de traduction et un texte. Ou alors juste "langs-list" en argument pour voir les langages. Si un seul langage mis, détection automatique.`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
        }

        if(args[0] === "langs-list") {
            const langsList = "```\n" + langs.map(l => l).join(", ") + "```";
                
            embed.setDescription(`Voici la liste des langues disponibles ! \n\n${langsList}`);

            return message.channel.send(embed);
        }

        let from, to, text;

        if(args.length == 2) {
            from = 'auto';
            to = args[0].toLowerCase();
            text = args.slice(1).join(' ').trim();
        }

        else {
            from = args[0];
            to = args[1].toLowerCase();
            text = args.slice(2).join(' ').trim();
        }


        const embed2 = client.createEmbed(client.color.blue, message, true)
            .setDescription(`<a:Loading:708746375621247087> Traduction en cours...`);

        const pWait = await message.channel.send(embed2);

        if((from != 'auto' && !langs.includes(from)) || !langs.includes(to)) {
            embed
                .setDescription(`Erreur ! \nLangue invalide.`)
                .addField(`Utilisation :`, `${this.usage}`);

            return pWait.edit(embed);
        }

        const translated = await translate(text, { from, to });

        embed
            .addField(translated.from.language.iso, "```" + text + "```")
            .addField(to, "```" + translated.text + "```");


        pWait.edit('', embed);

        client.removeModule('utils');

    }
};