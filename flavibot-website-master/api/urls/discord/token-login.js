const index = require("../../index")
const config = require("../../../config.json")

module.exports = {
    absolute: true,
    url: "/discord/token-login/:token",
    type: "get",
    onCalled: (req, res, bdd) => {
        index.checkAuth(req, res, async () => {
            const token = req.params.token;
            const result = await bdd.query("SELECT * FROM users WHERE token=?", [token])
            if (result.rows.length > 0) {
                bdd.all("UPDATE users SET accessToken=?, refreshToken=?", [req.user.accessToken, req.user.refreshToken])
            } else {
                bdd.all("INSERT INTO users(token, accessToken, refreshToken)  VALUES (?, ?, ?)", [token, req.user.accessToken, req.user.refreshToken])
            }
            res.redirect(`${config.baseUrl}`)
        })
    }
}
