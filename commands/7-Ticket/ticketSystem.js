/**
 * Enable / Disable ticket's system
 */
module.exports = {
	id: 78,
    name: 'tSystem',
    aliases: ['tsystem', 'ticketsystem'],
	description: `Active ou désactive le système de tickets. Si c'est la première activation, créé un channel et une catégorie.`,
    arguments: `<on|off>`,
    permissions: ['MANAGE_GUILD'],
    userPerms: ['MANAGE_GUILD'],
    guildOnly: true,
    premium: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
        
		if(args.length !== 1 || !['on', 'off'].includes(args[0])) {
            return message.channel.send(client.resultEmbed(client.color.fail, this.usage));
        }

        const enable = args[0] === 'on';

        let resultMessage;

        if(enable) {
            resultMessage = client.resultEmbed(client.color.success, `:white_check_mark: Système de ticket activé`);


            const category = message.guild.channels.cache.find(chan => chan.type === 'category' && /ticket/.test(chan.name));

            if(!category) {
                message.guild.channels.create('tickets', {type: 'category'}).then(cat => {
                    cat.updateOverwrite(message.guild.roles.cache.find(r => r.name === '@everyone'), {
                        VIEW_CHANNEL: false
                    });
                });

                message.channel.send(`La catégorie \`tickets\` vient d'être créée.`);
            }


        }


        else {
            resultMessage = client.resultEmbed(client.color.success, `:white_check_mark: Système de ticket désactivé`);
        }


        message.channel.send(resultMessage);
	}
}