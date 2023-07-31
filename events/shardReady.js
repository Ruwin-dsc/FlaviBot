/**
 * Runs when a shard is ready
 * @class
 */
module.exports = class {

	/**
	 * @constructor
	 * @param {Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Handles event when occurs
	 * @param {number} id shard's id
	 */
	async run(id) {

		this.client.wh.shardStatus.send(`<:Online:696412815363276930> | Shard #${id} is **Ready** !`).catch(e => console.error('ShardReady WebHook error'));

	}
}