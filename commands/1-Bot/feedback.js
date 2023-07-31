/**
 * Send feedback report to Bot developers
 */
module.exports = {
	id: 4,
	name: 'feedback',
	aliases: ['bug'],
	description: `Permet de donner son avis sur le bot ou de reporter un bug`,
	arguments: `<message>`,
	disabled: true,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	run(client, message, language, args) {

		const cmd = (message.content.split(' ')[0].slice(client.prefix.length) === 'bug')? 'Bug' : 'Avis';

		let avis = args.slice(0).join(" ");

		const embed = client.createEmbed(client.color.blue, message, true);

		if(avis) {
			const embedRes = client.resultEmbed(client.color.success, `:white_check_mark: ${cmd} envoyé !`);
			message.channel.send(embedRes);

			embed
				.addField("ID :", `\`${message.author.id}\``)
				.addField(`${cmd} :`, `${avis}`);

			client.wh.feedback.send(embed);
		}
		
		else {
			const usage = (cmd === 'Bug')? this.usage.replace(this.name, 'bug') : this.usage;

			embed
				.setDescription(`Veuillez préciser un ${cmd} !`)
				.addField(`Utilisation :`, `${usage}`, true);
				
			message.channel.send(embed);
		}

	}
};