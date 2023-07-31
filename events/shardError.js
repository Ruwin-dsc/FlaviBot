/**
 * Runs when a shard has a error
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
	async run(shardID, error) {

		this.client.wh.shardStatus.send(`<:Dnd:696412815447031878> | Shard #${shardID} has a **Error** ! \n\`\`\`js ${error} \`\`\``).catch(e => console.error('ShardError WebHook error'));
	}
}