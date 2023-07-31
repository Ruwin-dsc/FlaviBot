const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json")
const globalConfig = require("../config.json")

const appS = require('express')();
const server = require('http').createServer(appS);
const io = require('socket.io')(server);

io.on('connect', socket => {
    console.log("Socket connection server : OK")

    sendStats()

    client.setInterval(async () => {
        sendStats()
        console.log("\x1b[37m", "Données envoyées : ok")
    }, 5 * 60 * 1000);

    socket.on("clientStats-Callback", (data) => {
        console.log("\x1b[32m", data)
    })

    socket.on("clientGuild-Callback", (data) => {
        const guildInfos = client.guilds.cache.get(data);
        if (guildInfos) {
            socket.emit("clientGuild-info", guildInfos)
        }
    })

    function sendStats() {
        socket.emit("clientStats", [210, 46, 75]);
    }

});


server.listen(globalConfig.botSocketPort);

client.login(config.token).then(() => {
    console.log("Bot démarré !")
});
