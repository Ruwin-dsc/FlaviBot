const { MessageEmbed } = require('discord.js');

/**
 * Runs when a member quits a server the bot is in
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

        if(member.guild.id === "264445053596991498") return;

        const channel = member.guild.channels.cache.get(this.client._channels_.welcome);
        
        /*if(member.guild.id === "699989534724849685") {

            const flavibot = new MessageEmbed()
                .setColor(this.client.color.orange)
                .setAuthor(member.user.username, member.user.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle("Une personne est partie !")
                .setDescription(`<:Idle:696412815354888232> ${member.user.tag} a quitté le serveur **${member.guild.name}** !`)
                .setTimestamp()
                .setFooter(`Nous sommes désormais ${member.guild.memberCount} sur le serveur !`);

            channel.send(flavibot);
        }*/
        
        const user = this.client.users.cache.get(member.id);
        const serv = member.guild;

        const reqRequires = "etat_msg_leave, message_leave, leave_channel_id";
        const request = `SELECT ${reqRequires} FROM guilds WHERE id=$1`;

        this.client.db.query(request, [member.guild.id])
            .then(data => {
                if(!data?.rows || data?.rows.length === 0) return;

                const rows = data.rows;

                const dbGuild = rows[0];

                const channel = this.client.channels.cache.get(dbGuild.leave_channel_id);

                if(!channel || dbGuild.etat_msg_leave === false || dbGuild.message_leave === null || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;
            
                    const r = {
                        user: user.username,
                        tag: user.tag,
                        mention: `<@${user.id}>`,
                        server: serv.name,
                        memberCount: serv.memberCount
                    };

                    const message = dbGuild.message_leave.replace(/(\{(user|tag|mention|server|memberCount)\})/g, (c, p1, p2) => r[p2]);
            
                    channel.send(message);
            })
            .catch(err => this.client.sendError(err, 'guildMemberRemove'));
    }

}