/**
 * Show number of uses for top commands
 */
module.exports = {
	id: 65,
    name: 'cmdStats',
    aliases: ['cmdstats'],
    description: `Affiche les commandes les plus utilisées`,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

        const numberOfCmd = 20;

        // get all command's stats, get their name and number of uses, sort them, and remove the hidden, restricted, and inDev ones
		const stats = client.commandStats.fetchEverything().array().map(cmd => {
            return {
                name: client.commands.find(c => c.id === cmd.id)?.name || 'No name',
                uses: cmd.uses
            }
        }).sort((a, b) => a.uses < b.uses ? 1 : -1).filter(cmd => {
            const c = client.commands.get(cmd.name);
            return c && !c.hidden && !c.restricted && !cmd.inDev;
        }).slice(0, numberOfCmd);

        const emojis = [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'one::zero',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'
        ];

        let desc = '';

        for(let i in stats) {
            const cmd = stats[i];
            desc += `:${emojis[i]}: **${cmd.name}**: \`${cmd.uses}\`\n`;
        }


        const embed = client.createEmbed(client.color.blue, message, true)
            .setTitle(`Top des ${numberOfCmd} commandes les plus utilisées`)
            .setDescription(desc);

		message.channel.send(embed);

	}
};