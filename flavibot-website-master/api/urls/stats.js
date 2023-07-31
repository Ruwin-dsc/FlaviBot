const config = require("../../config.json")
const botSocket = require("socket.io-client")(`${config.baseUrl}:${config.botSocketPort}`);
// let apiSocket;

let stats = {
    guilds: 0,
    users: 0,
    commands: 0,
};

botSocket.on("clientStats", (data) => {
    botSocket.emit("clientStats-Callback", "Données reçues !")

    stats = {
        guilds: data[0],
        users: data[1],
        commands: data[2],
    };
});

module.exports = {
    type: "get",
    url: "stats",
    load: (/*io*/) => {
        // apiSocket = io;
    },
    onCalled: (req, res) => {
        res.send({
            data: {
                userCount: stats.users,
                guildCount: stats.guilds,
                commandCount: stats.commands
            }
        })
    }
}
