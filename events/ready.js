/**
 * Runs when the bot is ready
 * @class
 */
module.exports = class {

	/**
	 * @constructor
	 * @param {Client} client
	 */
	constructor(client) {
		this.client = client;
		this.act = -1;

		// less clean than real require, but we can do dynamic importation
		this.guildNumber = this.client.loadModule('utils').guildNumber;
	}

	/**
	 * Handles event when occurs
	 */
	async run() {

		console.log("Shard #" + this.client.shard.ids[0] + " has started");

		if(this.client.shard.ids.includes(this.client.shard.count - 1)) {
			console.log("Ready. Logged as " + this.client.user.tag + ". Some stats:\n");

			this.client.shard.broadcastEval(() => {
				console.log(`\x1b[32m%s\x1b[0m`, `SHARD [${this.shard.ids[0]}]`, "\x1b[0m", `Serving ${this.users.cache.size} users in ${this.guilds.cache.size} servers.`);
			});
			
			console.log(`Le bot est prêt ! ${await this.guildNumber(this.client)}`);
		}




		const flaviGuild = this.client.guilds.cache.get("699989534724849685")

		flaviGuild.fetchInvites()
			.then(invites => this.client.guildInvites.set(flaviGuild.id, invites))
			.catch(err => console.log(err));

		console.log(`Invites chargées !`)

		this.client.refreshAllPrefixes();


		// this.startSocket();

		this.startwebsite();

		this.setActivity();

		// changing bot's activity
		this.client.setInterval(async () => {
			this.setActivity();
		}, 300 * 1000);



	}

	// /**
	//  * Start socket server
	//  */
	// async startSocket() {
	// 	try {

	// 		const appS = require('express')();
	// 		const server = require('http').createServer(appS);
	// 		const io = require('socket.io')(server);
			
		
	// 		io.on('connect', socket => {
	// 			console.log("Socket : Server connected")
	// 		});
		
	// 		server.listen(5050);
		
	// 	}
		
	// 	catch(err) {
	// 		return console.log('Error onReady: ', err);
	// 	}
	// }

	/**
	 * Start website
	 */
	async startwebsite() {
		try {

			const app = require(`${this.client.root}/dashboard/app.js`);

			const lanchWebsite = new app(this.client);
			lanchWebsite.start();
		
		}
		
		catch(err) {
			return console.log('Error onReady: ', err);
		}
	}

	/**
	 * Set the bot's activity
	 */
	async setActivity() {
		try {
			if(!this.client.config.maintenance) {

				this.act = (this.act+1) % this.client.config.botActivities.length;

				const act = this.client.config.botActivities[this.act];

				const n = await this.guildNumber(this.client);

				const users = await this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
					.then(results => this.client.formatNumber(results.reduce((prev, memberCount) => prev + memberCount, 0)));
				
				
				const premiumUsers = await this.client.db.query(`SELECT COUNT(*) FROM guilds WHERE premium >= 1`)
					.then(data =>  this.client.formatNumber(parseInt(data.rows[0].count))).catch(console.error);
				
				const activity = act.name.replace('{totalGuilds}', n).replace(/\{prefix\}/g, this.client.prefix).replace('{totalUsers}', users).replace('{premiumUsers}', premiumUsers);

				this.client.user.setActivity(activity, { type: act.type });
			}

			else {
				await this.client.user.setActivity("Maintenance en cours...", { type: "WATCHING" });
			}

		}
		
		catch(err) {
			return console.log('Error onReady: ', err);
		}
	}
}
