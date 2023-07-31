/**
 * Show last Bot uptime
 */
module.exports = {
	id: 15,
	name: 'uptime',
	description: `Permet de voir depuis combien de temps le bot est en ligne`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	run(client, message, language, args) {

		const { getUptime } = client.loadModule('utils');
		
		const uptime = getUptime(client.uptime / 1000);
		
		client.removeModule('utils');

		const embed = client.createEmbed(client.color.blue, message, true)
			.setThumbnail(client.user.displayAvatarURL)
			.addField(`${language.COMMAND_UPTIME}`, `${uptime}`, true);

		message.channel.send(embed);

	}
};


