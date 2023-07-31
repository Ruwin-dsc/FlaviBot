/**
 * Runs when a shard is reconnecting
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

		this.client.wh.shardStatus.send(`<:Idle:696412815354888232> | Shard #${id} is **Reconnecting** !`).catch(e => console.error('ShardReconnecting WebHook error'));
	}
}