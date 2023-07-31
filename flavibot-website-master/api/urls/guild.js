const config = require("../../config.json")
const botSocket = require("socket.io-client")(`${config.baseUrl}:${config.botSocketPort}`);
const fetch = require("node-fetch");
// let apiSocket;


module.exports = {
    type: "get",
    url: ":token/guild/:id",
    load: (/*io*/) => {
        // apiSocket = io;
    },
    onCalled: (req, res) => {
        
        botSocket.emit("clientGuild-Callback", req.params.id)
        
        let guild;
        
        botSocket.on("clientGuild-info", (data) => {
            botSocket.emit("clientGuild-Callback", "Données reçuessss !")
        
            guild = data;
        
        });


        fetch(`${config.baseUrl}:${config.apiPort}/api/v1/verifier/token/${req.params.token}`).then(res => res.json()).then(json => {
            if (json.data.alreadyUsed) {
                if (guild !== undefined) {

                    res.send({
                        status: "SUCCESS",
                        data: {
                            guildInfos: guild,
                        }
                    })
                } else {
                    res.send({
                        status: "ERRORS",
                        data: {
                            message: "You don't have permission"
                        }
                    })
                }

            } else {
                res.send({
                    status: "ERRORS",
                    data: {
                        message: "No permission"
                    }
                })
            }
        })

    }
}
