module.exports = {
    type: "get",
    url: "verifier/token/:token",
    /**
     *
     * @param req
     * @param res
     * @param bdd {sqlite3.Database}
     */
    onCalled: async (req, res, bdd) => {
        const query = await bdd.query("SELECT * FROM users WHERE token=?", [req.params.token])
        if (query.rows.length !== 0) {
            res.send({
                status: "SUCCESS",
                data: {
                    alreadyUsed: true,
                    usedIn: query.rows[0]
                }
            })
        } else {
            res.send({
                status: "SUCCESS",
                data: {
                    alreadyUsed: false,
                }
            })
        }
    }
}
