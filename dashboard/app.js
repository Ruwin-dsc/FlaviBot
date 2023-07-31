const moment = require("moment"),
	express = require("express"),
	path = require("path"),
	passport = require("passport"),
	Strategy = require("passport-discord").Strategy,
	session = require("express-session"),
	MemoryStore = require("memorystore")(session),
	bodyParser = require('body-parser'),
	app = express();

module.exports = class {
	constructor(bot) {
		this.config = require("./config");
		this.token = this.config.token;
		this.bot = bot;
	}

	async start() {
		this.startWeb();
	}

	async startWeb() {
		passport.serializeUser((user, done) => {
			done(null, user);
		});

		passport.deserializeUser((obj, done) => {
			done(null, obj);
		});

		passport.use(new Strategy({
			clientID: this.config.botID,
			clientSecret: this.config.dashboard.secret,
			callbackURL: this.config.dashboard.callback,
			scope: ["identify", "guilds"]
		},
			(accessToken, refreshToken, profile, done) => {
				process.nextTick(() => done(null, profile));
			}
		)
		);

		app.use(express.static(path.join(__dirname, "dashboard/public")))
			.engine("html", require("ejs").renderFile)
			.set("view engine", "html")
			.set('views', path.join(__dirname, "dashboard/views"))
			.set("port", this.config.dashboard.port)
			.use(bodyParser.urlencoded({ extended: false }))
			.use(bodyParser.json())
			.use(
				session({
					store: new MemoryStore({ checkPeriod: 99999999 }),
					secret: "flavibot",
					resave: false,
					saveUninitialized: false
				})
			)
			.use(passport.initialize())
			.use(passport.session());




		const socket = require('socket.io-client')('http://localhost:5050');



		let statistiques = {
			guilds: 0,
			users: 0,
			commands: 0
		};

		socket.on('ClientStats', data => {

			statistiques = {
				guilds: data[0],
				users: data[1],
				commands: data[2]
			};

			// console.log(data.infos)
		});







		let botInfo = await this.getBotInfo(this.bot);
		let shardInfo = await this.getShardInfo(this.bot);

		// setInterval(async () => {
		botInfo = await this.getBotInfo(this.bot);
		// 	console.log("update site")
		// }, 5 * 1000);

		setInterval(async () => {
			shardInfo = await this.getShardInfo(this.bot);
		}, 30 * 1000);



		const renderTemplate = (res, req, template, data = {}) => {
			const baseData = {
				bot: this.bot,
				path: req.path,
				user: req.isAuthenticated() ? req.user : null
			};
			res.render(
				path.resolve(__dirname + `${path.sep}dashboard${path.sep}views${path.sep}${template}`),
				Object.assign(baseData, data)
			);
		};

		app.get("/connexion", (req, res, next) => {
			req.session.backURL = "/";
			next();
		}, passport.authenticate("discord"));

		app.get("/callback", passport.authenticate("discord"), (req, res) => {
			res.redirect("/");
		});

		app.get("/logout", (req, res) => {
			req.session.destroy(() => {
				req.logout();
				res.redirect("/");
			});
		});


		//index
		app.get("/", async (req, res) => {
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}
			renderTemplate(res, req, "index.ejs", {
				stats,
				statistiques
			})
		});

		//Information
		app.get("/infos", async (req, res) => {
			const client = this.bot;
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}
			renderTemplate(res, req, "informations.ejs", {
				client,
				stats
			})
		});

		//Commandes
		app.get("/commands", async (req, res) => {
			const client = this.bot;
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}
			renderTemplate(res, req, "commands.ejs", {
				client,
				stats
			})
		});

		// //Contact
		// 	app.get("/status", async (req, res) => {
		// 		renderTemplate(res, req, "status.ejs", {
		// 		stats
		// 	  	})
		// 	});

		//status
		app.get("/status", async (req, res) => {
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}

			const shard = {
				values: shardInfo.values,
				statusT: shardInfo.statusT,
				count: shardInfo.count
			}
			renderTemplate(res, req, "status.ejs", {
				stats,
				shard
			});
		});


		app.get("/dashboard", async (req, res) => {
			if (!req.isAuthenticated()) {
				res.redirect("/connexion");
				return;
			}
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}
			renderTemplate(res, req, "dashboard.ejs", {
				stats
			});
		});

		app.get("/leaderboard/:guild_id", async (req, res) => {

			const guildid = req.params.guild_id;
			const guild = this.bot.guilds.cache.get(guildid);

			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}

			const shard = {
				values: shardInfo.values,
				statusT: shardInfo.statusT,
				count: shardInfo.count
			}

			if (!guild) {
				renderTemplate(res, req, "404.ejs", {
					stats
				})
			}

			const members = await guild.members.fetch();

			const client = this.bot;

			renderTemplate(res, req, "leaderboard.ejs", {
				stats,
				shard,
				guildid,
				members,
				client
			});
		});

		app.get("/dashboard/serveurs/:guild_id", async (req, res) => {
			if (!req.isAuthenticated()) {
				res.redirect("/connexion");
				return;
			}


			const guildid = req.params.guild_id;
			const guild = this.bot.guilds.cache.get(guildid);

			if (!guild) {
				res.redirect("/dashboard")
			}

			const member = await guild.members.fetch(req.user.id);

			if (!member) {
				res.redirect("/dashboard")
			}

			if (!member.permissions.has("MANAGE_GUILD")) {
				res.redirect("/dashboard")
			}


			const welcomeEtat = await this.bot.db.query(`SELECT etat_msg_wlcm FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);
			const welcomeChannel = await this.bot.db.query(`SELECT wlcm_channel_id FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);
			const welcomeMessage = await this.bot.db.query(`SELECT message_wlcm FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);

			const leaveEtat = await this.bot.db.query(`SELECT etat_msg_leave FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);
			const leaveChannel = await this.bot.db.query(`SELECT leave_channel_id FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);
			const leaveMessage = await this.bot.db.query(`SELECT message_leave FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);

			const prefix = await this.bot.db.query(`SELECT prefix FROM guilds WHERE id='${guildid}'`).then(({ rows }) => rows[0]);

			const guild_channels = guild.channels.cache.filter(r => r.type == "text");
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J",
				wlc_state: welcomeEtat,
				wlc_chan: welcomeChannel,
				wlc_msg: welcomeMessage,
				lve_state: leaveEtat,
				lve_chan: leaveChannel,
				lve_msg: leaveMessage,
				g_chan: guild_channels,
				prefix: prefix,
				g_id: guild.id
			}
			renderTemplate(res, req, "serveurs.ejs", {
				stats
			});
		});

		app.post("/api/changeInfo/:info", async (req, res) => {
			if (!req.isAuthenticated()) {
				res.json({ "code": "404", "info": "L'utilisateur n'est pas connecté." });
			}

			const value = req.params.info,
				body = req.body,
				gid = body.guild_id;

			const guild = this.bot.guilds.cache.get(gid);
			if (!guild) {
				res.json({ "code": "401", "info": "Serveur inéxistant." });
			}

			const member = await guild.members.fetch(req.user.id);

			if (!member) {
				res.json({ "code": "401", "info": "L'utilisateur n'est pas dans le serveur." });
			}

			if (!member.permissions.has("MANAGE_GUILD")) {
				res.json({ "code": "401", "info": "L'utilisateur ne possède pas suffisamment de permissions." });
			}

			switch (value) {
				case "prefix":
					if (req.body.prefix == req.body.lastPrefix) {
						res.json({ "code": "405", "info": "Le préfixe choisis est déjà celui actuelle." });
						break;
					}
					if (req.body.prefix.length < 1 || req.body.prefix.length > 3) {
						res.json({ "code": "405", "info": "Le préfixe choisis est déjà celui actuelle." });
						break;
					}

					const prefix = req.body.prefix.trim();

					this.bot.db.query(`UPDATE guilds SET prefix=$1 WHERE id=$2`, [prefix, gid])
					this.bot.prefixes[gid] = prefix;
					res.json({ "code": "200", "info": "Le préfixe à été modifié avec succès.", "new": prefix });
					break;

				case "bvn":
					const lastEtat = req.body.lastEtat;
					const etat = req.body.etat;

					const chan = req.body.chan;
					const lastChan = req.body.lastChan;

					const msg = req.body.msg ? req.body.msg.replace(/<br\/>/g, "\n") : req.body.msg;
					const lastMsg = req.body.lastMsg;

					if (etat == lastEtat && chan == lastChan && msg == lastMsg) {
						res.json({ "code": "405", "info": "Aucune donnée modifié." });
						break;
					}

					if (etat != lastEtat) {
						if (etat && etat != true) {
							res.json({ "code": "405", "info": "L'état du message de bienvenue est inéxistant." });
							break;
						} else {
							if (!etat || etat == false) {
								this.bot.db.query(`UPDATE guilds SET etat_msg_wlcm=false WHERE id=$1`, [gid])
								if (chan == lastChan && msg == lastMsg) {
									res.json({ "code": "200", "info": "État du message de bienvenue modifié avec succès !", "new": etat });
									break;
								}
							} else {
								this.bot.db.query(`UPDATE guilds SET etat_msg_wlcm=true WHERE id=$1`, [gid])
								if (chan == lastChan && msg == lastMsg) {
									res.json({ "code": "200", "info": "État du message de bienvenue modifié avec succès !", "new": etat });
									break;
								}
							}
						}
					}

					if (chan != lastChan) {
						if (chan == "none") {
							this.bot.db.query(`UPDATE guilds SET wlcm_channel_id=null WHERE id=$1`, [gid])
							if (msg == lastMsg) {
								res.json({ "code": "200", "info": "Le channel de bienvenue à bien été modifié avec succès !", "new": "none" });
								break;
							}
						} else {
							const c = this.bot.channels.cache.get(chan);
							if (!c) {
								res.json({ "code": "405", "info": "Le channel indiqué n'éxiste pas." });
								break;
							} else {
								if (!c.permissionsFor(guild.me).has('SEND_MESSAGES')) {
									res.json({ "code": "405", "info": "Je n'ai pas les permissions d'envoyer des messages dans ce channel." });
									break;
								} else {
									this.bot.db.query(`UPDATE guilds SET wlcm_channel_id=$1 WHERE id=$2`, [c.id, gid])
									if (msg == lastMsg) {
										res.json({ "code": "200", "info": "Le channel de bienvenue à bien été modifié avec succès !", "new": c.name });
										break;
									}
								}
							}
						}

					}

					if (msg != lastMsg && msg) {
						if (msg.length < 11 || msg.length > 1500) {
							res.json({ "code": "405", "info": "Le message de bienvenue est trop long/court." });
							break;
						} else {
							this.bot.db.query(`UPDATE guilds SET message_wlcm=$1 WHERE id=$2`, [msg, gid])
							res.json({ "code": "200", "info": "Le message de bienvenue à bien été modifié avec succès !", "new": msg });
							break;
						}
					}
					break;

				case "lve":
					const lastEtat1 = req.body.lastEtat;
					const etat1 = req.body.etat;

					const chan1 = req.body.chan;
					const lastChan1 = req.body.lastChan;

					const msg1 = req.body.msg ? req.body.msg.replace(/<br\/>/g, "\n") : req.body.msg;
					const lastMsg1 = req.body.lastMsg;

					if (etat1 == lastEtat1 && chan1 == lastChan1 && msg1 == lastMsg1) {
						res.json({ "code": "405", "info": "Aucune donnée modifié." });
						break;
					}

					if (etat1 != lastEtat1) {
						if (etat1 && etat1 != true) {
							res.json({ "code": "405", "info": "L'état du message de départ est inéxistant." });
							break;
						} else {
							if (!etat1 || etat1 == false) {
								this.bot.db.query(`UPDATE guilds SET etat_msg_leave=false WHERE id=$1`, [gid])
								if (chan1 == lastChan1 && msg1 == lastMsg1) {
									res.json({ "code": "200", "info": "État du message de départ modifié avec succès !", "new": "Désactivé" });
									break;
								}
							} else {
								this.bot.db.query(`UPDATE guilds SET etat_msg_leave=true WHERE id=$1`, [gid])
								if (chan1 == lastChan1 && msg1 == lastMsg1) {
									res.json({ "code": "200", "info": "État du message de départ modifié avec succès !", "new": "Activé" });
									break;
								}
							}
						}
					}

					if (chan1 != lastChan1) {
						if (chan1 == "none") {
							this.bot.db.query(`UPDATE guilds SET leave_channel_id=null WHERE id=$1`, [gid])
							if (msg1 == lastMsg1) {
								res.json({ "code": "200", "info": "Le channel de départ à bien été modifié avec succès !", "new": "none" });
								break;
							}
						} else {
							const c1 = this.bot.channels.cache.get(chan1);
							if (!c1) {
								res.json({ "code": "405", "info": "Le channel indiqué n'éxiste pas." });
								break;
							} else {
								if (!c1.permissionsFor(guild.me).has('SEND_MESSAGES')) {
									res.json({ "code": "405", "info": "Je n'ai pas les permissions d'envoyer des messages dans ce channel." });
									break;
								} else {
									this.bot.db.query(`UPDATE guilds SET leave_channel_id=$1 WHERE id=$2`, [c1.id, gid])
									if (msg1 == lastMsg1) {
										res.json({ "code": "200", "info": "Le channel de départ à bien été modifié avec succès !", "new": c1.name });
										break;
									}
								}
							}
						}

					}

					if (msg1 != lastMsg1 && msg1) {
						if (msg1.length < 11 || msg1.length > 1500) {
							res.json({ "code": "405", "info": "Le message de départ est trop long/court." });
							break;
						} else {
							this.bot.db.query(`UPDATE guilds SET message_leave=$1 WHERE id=$2`, [msg1, gid])
							res.json({ "code": "200", "info": "Le message de bienvenue à bien été modifié avec succès !", "new": msg1 });
							break;
						}
					}
					break;

				default:
					res.json({ "code": "400", "info": "Bad Request." });
					break;
			}
		});

		app.get("*", (req, res) => {
			const stats = {
				serv: botInfo.guilds_size,
				name: botInfo.username,
				users: botInfo.users_size,
				pdp: botInfo.avatar,
				invite: `https://discordapp.com/oauth2/authorize?client_id=${botInfo.id}&scope=bot&permissions=-1`,
				vote: `https://top.gg/bot/${botInfo.id}/vote`,
				support: "https://discord.gg/zJyE39J"
			}
			renderTemplate(res, req, "404.ejs", {
				stats
			})
		});

		app.listen(app.get("port"), () => {
			console.log("Le site écoute le port : " + app.get("port"));

		});




	}

	getBotInfo(bot) {
		return new Promise(async (resolve, reject) => {


			const users_size = await bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			const botInfo = {
				"id": bot.user.id,
				"username": bot.user.username,
				"tag": bot.user.tag,
				"guilds_size": bot.guilds.cache.size,
				"users_size": users_size,
				"avatar": bot.user.avatarURL({ format: 'png' })
			}
			resolve(botInfo)
		});
	}

	getShardInfo(bot) {
		return new Promise(async (resolve, reject) => {
			const users_size = await bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			let values = await bot.shard.broadcastEval(`
				[
					this.ws.status,
					this.shard.ids,
					this.guilds.cache.size,
					this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
					this.ws.ping,
					Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
					Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
				]
				`);

			const promises = [
				bot.shard.fetchClientValues('guilds.cache.size'),
				bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
			];

			Promise.all(promises)
				.then(async results => {

					const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
					const totalUsers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
					const RAMmax = values.map(x => x[5]).reduce((prev, ramCount) => prev + ramCount).toFixed(2);

				})

			const statusT = [
				'Online',				//ready
				'Connecting',       	//Connecting
				'Reconnecting', 		//Reconnecting
				'Idle', 				//Idle
				'Nearly',           	//Nearly
				'Disconnected',  		//Disconnected
				'Waiting for guilds',	//Waiting for guilds
				'Identifying',			//Identifying
				'Resuming'				//Resuming
			];

			const shardInfo = {
				"values": values,
				"statusT": statusT,
				"count": bot.shard.count
			}
			resolve(shardInfo)
		});

	}



}