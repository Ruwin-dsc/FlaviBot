/**
 * Add / remove a role to someone
 */
module.exports = {
	id: 57,
	name: 'role',
	description: `Permet d'ajouter/retirer un rôle à une personne`,
	arguments: `@mention @role`,
	permissions: ['MANAGE_ROLES'],
	userPerms: ['DEV', 'MANAGE_ROLES'],

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true);


		const member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

		if(!member) {

			embed
				.setDescription("Vous devez mentionnez la personne a qui vous voulez attribuer un role.")
				.addField("Utilisation :", `${this.usage}`);

		}
		
		else {
			// get the role
			var role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args.slice(1).join(" ")) || message.guild.roles.cache.get(args[1]);
			
			// role not precised
			if(!role) {
				embed.setDescription("Vous n'avez pas précisez le role valide !");
			}

			// cannot add this role
			else if(message.guild.members.cache.get(client.user.id).roles.highest.position <= role.position) {
				embed.setDescription("❌ Je n'ai pas les permisisons nécessaires. je suis plus bas que la personne hiérarchiquement.");
			}

			// canot add this role
			else if(message.member.roles.highest.position <= role.position) {
				embed.setDescription("Vous ne pouvez pas ajouter / retirer de rôle plus gradé que le vôtre.");
			}
			
			// have the role: remove it
			else if(member.roles.cache.has(role.id)) {
				await member.roles.remove(role.id);
				embed.setDescription(`${member} n'a plus le rôle ${role}`);
			}

			// does not have the role: add it
			else {
				await member.roles.add(role.id);
				embed.setDescription(`${member} a maintenant le rôle ${role}`);
			}

		}

		message.channel.send(embed);
		
	}
}
