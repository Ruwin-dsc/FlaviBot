// GIVEAWAYS



// Extends the GiveawaysManager class and update the refreshStorage method
const { GiveawaysManager } = require("discord-giveaways");

/**
 * @class
 */

const GiveawayManagerWithShardSupport = class extends GiveawaysManager {

	/**
     * Refresh storage method is called when the database is updated on one of the shards
     * @param {Client} client
     * @return {Object}
     */
	async refreshStorage(client) {
		// This should make all shard refreshing their cache with the updated database
		return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
	}

};


/**
 * Giveaway manager
 * @param {Client} client
 */
module.exports = client => {
    client.GiveawaysManager = new GiveawaysManager(client, {
        storage: `${client.root + client.config.paths.json}/giveaways.json`,
        updateCountdownEvery: 60 * 10000,
        default: {
            botsCanWin: false,
            exemptPermissions: [],
            embedColor: "#fffffe",
            reaction: "🎉"
        }

    });

};

