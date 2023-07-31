const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch")

/**
 * Show donation paypal's link
 */
module.exports = {
	id: 82,
	name: 'test',
	description: `Commande de test`,
	restricted: true,
	hidden: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message, language, args) {



		// const memberM = await client.getMember(message, args);

		// if (!memberM) {

		// // member not found
		// const embedv = new MessageEmbed()
		// 	.setColor(client.color.blue)
		// 	.setDescription(`Utilisateur introuvable !`)
		// 	.setTimestamp()
		// 	.setFooter(client.footerT(message.guild.id), client.footerI())s

		// return message.channel.send(embedv);

		// }
		// console.log(memberM)

		// message.channel.send("```js\n"+memberM+"\n```")

		// const memberM2 = message.guild.members.cache.get(memberM.id);

		// let booster = message.guild.roles.cache.filter(x => x.managed && x.hoist).map(e => e.id)[0]

		// console.log(booster)
		// memberM2.roles.cache.has(booster) ? message.channel.send("ok") : message.channel.send("nope")



		// try {

		// 	let url = `https://discord.com/api/v6/users/${message.author.id}`

		// 	await fetch(url, {

		// 		headers: { "Authorization": "Bot " + client.token },

		// 	})
		// 	.then(res => res.json())
		// 	.then(json => console.log(json))


		//     } catch (err){


		// 	console.log(err)


		//     }

	}
};