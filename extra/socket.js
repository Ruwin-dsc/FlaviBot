// Socket manager
const appS = require('express')();
const server = require('http').createServer(appS);
const io = require('socket.io')(server);


/**
 * Socket manager
 * @param {Client} client
 */
module.exports = async client => {

    io.on('connect', socket => {
        console.log("Socket connection server : OK")



        
        socket.emit("ClientStats", [client.guilds.cache.size, 0, client.commands.array().filter(cmd => !cmd.hidden).length]);

        client.setInterval(async () => {

            const users = await client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
            .then(results => results.reduce((prev, memberCount) => prev + memberCount, 0));

            socket.emit("ClientStats", 
                [client.guilds.cache.size, users, client.commands.array().filter(cmd => !cmd.hidden).length]
            );
            // console.log("Stats updated")

        }, 5 * 60 * 1000);

    });

    server.listen(5050);




};