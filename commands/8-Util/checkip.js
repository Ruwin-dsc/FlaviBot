const ping = require('ping');
const { MessageEmbed } = require('discord.js');

/**
 * ping a given ip
 */
module.exports = {
	id: 49,
	name: 'checkip',
	description: `Permet d'avoir des informations sur une ip`,
	arguments: `<ip|domainURL>`,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

		// 0 or more than 3 ip given
		if(args.length == 0 || args.length > 3) {
			const embed = new MessageEmbed()
				.setColor(client.color.blue)
				.setDescription(`Veuillez indiquer au moins une IP / adresse à ping (max 3) !`)
				.addField(`Utilisation :`, `${this.usage}`);

			message.channel.send(embed);
		}
		
		else {

			args.forEach(async host => {
				host = host.trim();

				const embed = new MessageEmbed()
					.setColor(client.color.blue)
					.setTitle(`IP Information ${host}`);

				const res = await ping.promise.probe(host, { timeout: 10 });
					
				const color = (res.avg < 100)? '<:Online:696412815363276930>' : (res.avg < 500)? '<:Idle:696412815354888232>' : '<:Dnd:696412815447031878>';

				const msg = res.alive ? `${color} ${Math.round(res.avg)} ms` : `:x: Je n'ai pas pu établir de liaison avec cette adresse`;

				embed.setDescription(`:rocket: ${msg}`);
					
				message.channel.send(embed);

			});

		}
		
	}
};