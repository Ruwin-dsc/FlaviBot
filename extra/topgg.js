// TOP GG infos that needs to be sent every 3 minutes

const DBL = require("dblapi.js");
const { MessageEmbed } = require('discord.js');

/**
 * Top.gg manager
 * @param {Client} client
 */
module.exports = client => {

    if(client.shard.ids.includes(client.shard.count - 1) && client.config.maintenance === false) {

        // get access to topgg DBL
        const dbl = new DBL(client.config.topggtoken, { webhookPort: 2727, webhookAuth: '28IUFIFkuFkuvUTDyIHohioihOIHoihTffDUdUDuDd28' }, client);

        // when the number of server is posted
        dbl.on('posted', () => {
            console.log('Server count posted!');
        });

        // resend data every 3 hours
        client.setInterval(async () => {
            dbl.postStats(await client.shard.fetchClientValues('guilds.cache.size'), client.shard.id, 2);
        }, 180000);

        // an error has occured
        dbl.on('error', e => {
            console.log(`Oops! ${e}`);
        });

        // webhook
        dbl.webhook.on('ready', hook => {
            console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
        });

        // someone has voted
        dbl.webhook.on('vote', async vote => {
            
            console.log("vote ok")
            const embed = new MessageEmbed()
                .setColor(client.color.blue)
                .setDescription(`**Nouveau Vote !**`)
                .addField("Vote de :", `${(await client.users.fetch(vote.user)).tag}`, true)
                .setTimestamp()
                .setFooter(client.footerT(), client.footerI());

            client.wh.votes.send(embed).catch(e => console.error('WebHooks Top.gg error'));


            console.log(`User with ID ${(await client.users.fetch(vote.user)).tag} just voted!`);
        });
  
    }

};