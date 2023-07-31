/**
 * Change nickname a member
 */
module.exports = {
	id: 26,
	name: 'nick',
	description: `Permet de changer le pseudo d'une personne. Juste le mentionner enlève le pseudo`,
	arguments: `<@mention|ID> <pseudo?>`,
	permissions: ['MANAGE_NICKNAMES'],
	userPerms: ['DEV', 'MANAGE_NICKNAMES'],
	guildOnly: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.red, message, true);

		const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

		// user does not exist
		if(!user) {
			embed
				.setDescription(`Veuillez indiquer la personne à qui changer le pseudo !`)
				.addField(`Utilisation :`, `${this.usage}`);

			return message.channel.send(embed);
		}

		// get the member object of this user
		const member = message.guild.members.cache.get(user.id);

		// get the current nickname
		const oldNickname = member.nickname?? member.user.username;				

		// set new nickname
		if(args[1]) {
			const newNick = args.slice(1).join(' ').trim();

			member.setNickname(newNick);

			embed
				.setDescription(`Pseudo changé !`)
				.addField(`Ancien pseudo :`, oldNickname)
				.addField(`Nouveau pseudo :`, `${newNick}`);
		}

		// remove nickname
		else {
			// reset to no nick
			member.setNickname('');

			embed
				.setDescription(`Pseudo enlevé !`)
				.addField('Pseudo :', member.user.username);
		}
		

		message.channel.send(embed);

	}
};