const { Client } = require('pg');

/**
 * @class Database
 */
module.exports = class {
	/**
	 * @constructor
	 * @param {object} dbConfig configuration of the database (host, user, password, dbname)
	 */
	constructor(dbConfig = {}) {
		this.host = dbConfig?.host ?? 'localhost';
		this.user = dbConfig?.user ?? 'root';
		this.password = dbConfig?.password ?? '';
		this.dbname = dbConfig?.dbname ?? 'flavidb';

		this.link = null;
	}

	/**
	 * Connect to the database
	 */
	async connect() {
		// if we already are conncted, don't connect again
		if (this.link !== null) {
			return;
		}

		// create a new connection
		this.link = new Client({
			host: this.host,
			user: this.user,
			password: this.password,
			database: this.dbname,
			port: 5432
		});

		// on connection
		this.link.connect()
			.then(() => {
				console.log('Successfully connected to the database.')



			})
			.catch(e => {
				this.link = null;
				console.error('Failed to connect to the Database.\n', e);
			});
	}

	/**
	 * Connect to the database
	 */
	async disconnect() {
		if (this.link !== null) {
			this.link.end();
			this.link = null;
			console.log('Successfully disconnected from the database.');
		}
	}

	/**
	 * Reconnect to the database
	 * calls both disconnect and connect method
	 */
	async reconnect() {
		await this.disconnect();
		await this.connect();
	}



	/**
	 * Send a request to the database
	 */
	async query(request, data = []) {
		if (this.link !== null) {
			return this.link.query(request, data);
		}

		else {
			return null;
		}
	}

}