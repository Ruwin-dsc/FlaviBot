/**
 * Refresh every 20s the Bot's info status
 * @param {Client} client Discord client
 */
const actualisationping = async client => {
    // let channel = await client.channels.cache.get(client._channels_.status);
    // if(!channel) return;

    // let message = await channel.messages.fetch('754787721775415397');
    // if(!message) return;

    // const { getPingEmbed } = client.loadModule('utils');

    // const embed = await getPingEmbed(client);

    // client.removeModule('utils');
    
    // message.edit("", embed).catch(e => console.error('[ERROR] status edit'));
};


/**
 * status manager
 * @param {Client} client
 */
module.exports = client => {
    // client.setInterval(() => {
    //     actualisationping(client);
    // }, 20000);
}