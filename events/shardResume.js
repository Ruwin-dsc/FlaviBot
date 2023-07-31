/**
 * Runs when a shard resumed
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

		this.client.wh.shardStatus.send(`<:Online:696412815363276930> | Shard #${id} has **Resumed** !`).catch(e => console.error('ShardResume WebHook error'));
	}
}