const config = require("../config.json")

module.exports = {
    devServer: {
        disableHostCheck: true,
        port: config.basePort
    }
}
