/**
 * Skip to a precise music
 */
module.exports = {
	id: 40,
	name: 'skipto',
	description: `Permet de passer à une musique bien précise dans la queue`,
	disabled: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
		
		
		if(client.music[message.guild.id].dispatcher === null) {
			return message.reply(client.resultEmbed(client.color.fail, `:thinking: Je ne joue aucune musique`));
		}

		if(client.music[message.guild.id].broadcast) {
			return message.reply(client.resultEmbed(client.color.fail, `:thinking: Vous ne pouvez pas skip une radio`));
		}

		if(isNaN(args.join(' '))) {
			return message.reply('Vous n\'avez pas mis un nombre');
		}

		if(args.join(' ') > client.music[message.guild.id].queue - 1) {
			if(message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
				return message.react('💢');
			}
		}

		switch(client.music[message.guild.id].loop) {
			case 'off':
				client.music[message.guild.id].queue = null;
				client.music[message.guild.id].queue.slice(args.join(' ') - 1);
				client.music[message.guild.id].index = 0;
				play(message);
				break;

			default:
				await client.music[message.guild.id].dispatcher.destroy();
				client.music[message.guild.id].index = args.join(' ') - 1;
				play(message, guild);
				break;
		}

	}
};