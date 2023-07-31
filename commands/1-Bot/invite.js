module.exports = {
	id: 6,
	name: 'invite',
	aliases: ["invitebot", "invite-bot"],
	description: `Permet d'inviter le bot`,

	async run(client, message, language, args) {

		const embed = client.createEmbed(client.color.blue, message, true)
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.addField(`${language.COMMAND_INVITE}`, `[[click here]](https://discord.com/api/oauth2/authorize?client_id=684773505157431347&scope=bot&permissions=-1)`, true);

		message.channel.send(embed);

	}
};