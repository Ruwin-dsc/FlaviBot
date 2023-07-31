const { MessageEmbed } = require('discord.js');

/**
 * Runs when a member joins a server the bot is in
 * @class
 */
module.exports = class {

	/**
	 * @constructor
	 * @param {Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Handles event when occurs
	 * @param {GuildMember} member
	 */
	async run(member) {

		if (member.guild.id === "264445053596991498") return; // DBL server

		const channel = member.guild.channels.cache.get(this.client._channels_.welcome);

		const user = this.client.users.cache.get(member.id);
		const serv = member.guild;

		const reqRequires = "etat_msg_wlcm, message_wlcm, wlcm_channel_id, etat_autorole, id_autorole";
		const request = `SELECT ${reqRequires} FROM guilds WHERE id=$1`;

		this.client.db.query(request, [member.guild.id]).then(async data => {
			if (!data?.rows || data?.rows.length === 0) return;


			const rows = data.rows;

			const dbGuild = rows[0];

			const channel = this.client.channels.cache.get(dbGuild.wlcm_channel_id);

			if (!channel || dbGuild.etat_msg_wlcm === false || dbGuild.message_wlcm === null || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) {

			}

			else {

				const r = {
					user: user.username,
					tag: user.tag,
					mention: `<@${user.id}>`,
					server: serv.name,
					memberCount: serv.memberCount
				};

				const messageModif = dbGuild.message_wlcm.replace(/(\{(user|tag|mention|server|memberCount)\})/g, (c, p1, p2) => r[p2])


				if (member.guild.me.hasPermission("MANAGE_GUILD")) {
					const cachedInvites = this.client.guildInvites.get(member.guild.id);
					const newInvites = await member.guild.fetchInvites();
					this.client.guildInvites.set(member.guild.id, newInvites);

					try {

						const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

						channel.send(dbGuild.message_wlcm.replace(/(\{(user|tag|mention|server|memberCount)\})/g, (c, p1, p2) => r[p2])
							.replace("{user}", "<@" + member.user.id + ">")
							.replace("{user.name}", member.user.username)
							.replace("{user.tag}", member.user.tag)
							.replace("{user.createdat}", member.user.createdAt)
							.replace("{user.id}", member.user.id)
							.replace("{guild}", member.guild.name)
							.replace("{guild.count}", member.guild.memberCount)
							.replace("{inviter}", "<@" + usedInvite.inviter.id + ">")
							.replace("{inviter.name}", usedInvite.inviter.username)
							.replace("{inviter.tag}", usedInvite.inviter.tag)
							.replace("{inviter.id}", usedInvite.inviter.id)
							.replace("{invite.url}", "https://discord.gg/" + usedInvite.code)
							.replace("{invite.code}", usedInvite.code)
							.replace("{invite.uses}", usedInvite.uses)
						);

					} catch (err) {

						if (!member.bot) {
							channel.send(dbGuild.message_wlcm.replace(/(\{(user|tag|mention|server|memberCount)\})/g, (c, p1, p2) => r[p2])
								.replace("{inviter.tag}", "Inconnu")
								.replace("{invite.uses}", "\*\*"));
						}
					}

				} else {
					if (!member.bot) {
						channel.send(dbGuild.message_wlcm.replace(/(\{(user|tag|mention|server|memberCount)\})/g, (c, p1, p2) => r[p2])
							.replace("{inviter.tag}", "Inconnu")
							.replace("{invite.uses}", "\*\*"));

					}
				}

			}

			// must add the autorole
			if (dbGuild.etat_autorole && dbGuild.id_autorole !== null) {
				const role = member.guild.roles.cache.get(dbGuild.id_autorole);
				if (role && member.guild.me.hasPermission('MANAGE_ROLES') && member.guild.members.cache.get(this.client.user.id).roles.highest.position >= role.position) {
					try {
						member.roles.add(role);
					} catch (e) {
						// does not have the permission to add THIS role (highter than the bot role)
						console.log(e)
					}
				}
			}

		})
			.catch(err => this.client.sendError(err, 'guildMemberAdd'));



	}

}