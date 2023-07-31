const { MessageEmbed } = require('discord.js');

/**
 * ?
 */
module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run(event) {

		return; // disabled

		if(event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE") {
			if(event.d.user_id === "619650582407282688") return; // ?
			if(!event.d.guild_id || event.d.guild_id === "264445053596991498") return; // DBL

			this.client.db.query(`SELECT * FROM \`ticket\` WHERE guild_id=${event.d.guild_id}`)
				.then(res => {
					if(res[0]) {
						if(!event.t.emoji === ":open_file_folder:") return;

						const channel = this.client.channels.cache.get(event.d.channel_id);

						channel.messages.fetch(event.d.message_id).then(async msg => {

							const user = msg.guild.members.cache.get(event.d.user_id);

							if(msg.author.id == this.client.user.id && msg.id === res[0].msg_id) {

								if(event.t === 'MESSAGE_REACTION_ADD') {

									// whost ?
									if(user.id === "619650582407282688") return;

									const server = msg.guild;
									const memberObj = msg.guild.members.cache.get(user.id);
									let na = memberObj.user.username.toLowerCase().replace(/\s|[^a-z0-9]/gi, '-');

									if(msg.guild.channels.cache.some(r => r.name === "🚨-" + na)) {
										return memberObj.send("Vous avez déjà un ticket d'ouvert");
									}

									msg.guild.channels.create(`🚨-${na}`, "text").then(async c => {
										let category = server.channels.cache.find(c => c.name == "🔧Tickets🔧" && c.type == "category");

										if(!category) {
											await msg.guild.channels.create(`🔧Tickets🔧`, "category");
											category = await server.channels.cache.find(c => c.name == "🔧Tickets🔧" && c.type == "category");
										}

										await c.setParent(category.id);
										
										const role = msg.guild.roles.cache.get(res[0].supp_role);
										
										if(!role) {
											return;
											
											c.overwritePermissions([
												{
													id: server.id,
													deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
												},
												{
													id: memberObj.id,
													allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
												}
											], "ticket");
										}
										
										else {
											c.overwritePermissions([
												{
													id: role.id,
													allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
												},
												{
													id: server.id,
													deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
												},
												{
													id: memberObj.id,
													allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
												}
											], "ticket");
										}


										const pv = new MessageEmbed()
											.setTitle("Nouveau ticket")
											.setColor("#FA58F4")
											.setDescription(`Hey, tu as ouvert un ticket, il est disponible ici : [aller sur mon ticket](https://discordapp.com/channels/${msg.guild.id}/${msg.guild.channels.cache.find(r => r.name === "🚨-" + na).id})`);
										
										memberObj.send(pv);

										const embed = new MessageEmbed()//crÃƒÂ©ation de l'embed
											.setColor('#00ff0c')
											.addField("support ", res[0].msg_open)
											.setTimestamp();

										c.send(embed);
									});
								}

								if(event.t == "MESSAGE_REACTION_REMOVE") {
									const memberObj = msg.guild.members.cache.get(user.id);
									let na = memberObj.user.username.toLowerCase().replace(/\s|[^a-z0-9]/gi, '-');

									const channel = msg.guild.channels.cache.find(r => r.name === "🚨-" + na);

									if(!channel) return;

									const embed = new MessageEmbed()
										.setColor('#0e0e6d')
										.addField("support ", res[0].msg_close)
										.setTimestamp();

									memberObj.send(embed);

									channel.delete();
								}
								
							}
						});
					}
				})
				.catch(err => this.client.sendError(err, 'raw'));
			
		}
		
	}
}
