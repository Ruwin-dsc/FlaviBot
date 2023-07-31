/*
 * Imports
 */

const fs = require("fs")
const sqlite3 = require("sqlite3").verbose()
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const oauth2Refresh = require("passport-oauth2-refresh")
const Strategy = require("passport-discord").Strategy

const config = require("./config.json")
const globalConfig = require("../config.json")

/*
 * Database Management
 */
let db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
        console.error(err.message)
        process.exit(1)
    }
    console.log("Connected to sqlite")
})
db.query = function (sql, params) {
    const that = this;
    return new Promise(function (resolve, reject) {
        that.all(sql, params, function (error, rows) {
            if (error)
                reject(error);
            else
                resolve({rows: rows});
        });
    });
};

/*
 * Express App Management
 */
const app = express()

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next()
})

/*
 * Managing discord connection
 */
// STEP 1 : CONFIGURE PASSPORT
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

const strategy = new Strategy({
    clientID: config.bot.id,
    clientSecret: config.bot.secret,
    callbackURL: `${globalConfig.baseUrl}:${globalConfig.apiPort}${config.bot.callbackURL}`,
    scope: config.bot.scopes,
    prompt: config.bot.prompt,
}, ((accessToken, refreshToken, profile, done) => {
    profile.refreshToken = refreshToken
    process.nextTick(() => done(null, profile))
}))
passport.use(strategy)
oauth2Refresh.use(strategy)

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// STEP 2 : SETUP ROUTES

module.exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/discord/login')
}

app.get('/discord/login',
    (req, res, next) => {
        // CHECK THE TOKEN
        // STORE IT WITH THE IP
        next()
    },
    passport.authenticate('discord', {
            scope: config.bot.scopes,
            prompt: config.bot.prompt
        }
    ),
    (req, res) => {
    }
)
app.get("/discord/callback", passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect(globalConfig.baseUrl + ":" + globalConfig.basePort + '/token-login')
})
app.get("/discord/info", module.exports.checkAuth, (req, res) => {
    res.json(req.user)
})
app.get('/discord/logout/:token', (req, res) => {
    req.logout();
    db.all(`DELETE
            FROM users
            WHERE token = ?`, [req.params.token])
    res.redirect('/');
});
app.get('/', (req, res) => {
    res.redirect(globalConfig.baseUrl)
})


/*
 * Loading URLS/ files (paths)
 */
const urlFiles = fs
    .readdirSync("urls/")

for (const file of urlFiles) {
    initFile(file)
}

function initFile(file) {
    if (!file.endsWith(".js")) {
        const files = fs.readdirSync(`urls/${file}`)
        for (let f of files) {
            initFile(`${file}/${f}`)
        }
        return
    }
    console.log(`Loading ./urls/${file}`)
    const urlFile = require(`./urls/${file}`)
    if (urlFile.load) urlFile.load()
    const type = urlFile.type
    switch (type) {
        case "get": {
            app.get(`${urlFile.absolute ? '' : '/api/v1/'}${urlFile.url}`,
                (req, res) =>
                    urlFile.onCalled(req, res, db))
            break
        }
        case "post": {
            app.post(`${urlFiles.absolute ? '' : '/api/v1/'}${urlFile.url}`,
                (req, res) =>
                    urlFile.onCalled(req, res, db))
            break
        }
    }
}

/*
 * Starting app
 */
app.listen(globalConfig.apiPort, () => {
    console.log("Ready on " + globalConfig.baseUrl + ":" + globalConfig.apiPort)
})

module.exports.updateToken = (profile) => {
    oauth2Refresh.requestNewAccessToken('discord', profile.refreshToken, (err, accessToken) => {
        if (err) throw err
        process.accessToken = accessToken
    })
}
