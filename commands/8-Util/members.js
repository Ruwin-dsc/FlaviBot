/**
 * Shows members on a guild
 */
module.exports = {
	id: 55,
	name: 'members',
	description: `Permet de voir le nombre de personnes sur le serveur`,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {

		const members = await message.guild.members.fetch()

		const totalMembers = members.filter(m => m).size
		const humans = members.filter(m => !m.user.bot).size;
		const bots = members.filter(m => m.user.bot).size;

		let online 	= members.filter(m => m.presence.status === 'online').size;
		let dnd		= members.filter(m => m.presence.status === 'dnd').size;
		let idle 	= members.filter(m => m.presence.status === 'idle').size;
		let offline = members.filter(m => m.presence.status === 'offline').size;

		const embed = client.createEmbed(client.color.blue, message, true)
			.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
			.setDescription(`**${totalMembers}** membres\n**${humans}** Humains\n**${bots}** Bots \n`+
			`\n<:Online:696412815363276930> ${online}` +
			`\n<:Idle:696412815354888232> ${idle}` +
			`\n<:Dnd:696412815447031878> ${dnd}` +
			`\n<:Offline:696412815367471235> ${offline}`
			);

		message.channel.send(embed);

	}
};