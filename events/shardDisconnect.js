/**
 * Runs when a shard disconnect
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

		this.client.wh.shardStatus.send(`<:Offline:696412815367471235> | Shard #${id} is **Disconnected** !`).catch(e => console.error('ShardDisconnect WebHook error'));

	}
}