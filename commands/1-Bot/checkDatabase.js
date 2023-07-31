/**
 * Check that each guild the bot is in has its row in the database
 */
module.exports = {
	id: 76,
    name: 'checkDb',
    aliases: ['checkdb'],
	description: `Vérifie que chaque guilde du bot a bien une ligne dans la base de données.`,
	restricted: true,
    hidden: true,

	/**
	 * @param {Client} client
	 * @param {Message} message
     * @param {array<string>} args
	 */
	async run(client, message, language, args) {
        const now = Date.now();

        let verbose = 2;

        if(args.length > 0 && !isNaN(args[0])) {
            verbose = parseInt(args[0]);

            if(![0, 1, 2].includes(verbose)) {
                verbose = 2;
            }
        }

        let msg;

        if(now - this.cooldown >= this.cooldownDuration) {
            if(verbose > 0) {
                msg = await message.channel.send('Checking the database...');
            }

            if(client.db.link === null) {
                if(verbose > 0) {
                    msg.edit('Could not connect to the database.');
                }

                else {
                    console.log('[checkDatabase] Could not connect to the database.');
                }
            }

            else {
                if(verbose > 0) {
                    msg.edit('Connected to the database...');
                }
                
                if(verbose === 2) {
                    msg = await message.channel.send('Recovering id of every rows...');
                }

                client.db.query(`SELECT id FROM guilds`)
                    .then(async ({ rows }) => {
                        if(verbose === 2) {
                            msg.edit('Successfully recovered every ids.');
                            message.channel.send('Start checking each client guilds are in the database...');
                        }

                        const ids = rows.map(objectId => objectId.id);

                        const guildsId = client.guilds.cache.map(guild => {return {id: guild.id, name: guild.name};});

                        const missingGuilds = [];

                        const checkGuilds = async () => {
                            guildsId.forEach(guild => {
                                if(!ids.includes(guild.id)) {
                                    if(verbose === 2) {
                                        message.channel.send(`**Missing guild:** ${guild.name} \`${guild.id}\``);
                                    }

                                    missingGuilds.push(guild);
                                }
                            });
                        };

                        await checkGuilds();

                        if(verbose === 2) {
                            message.channel.send("I've finished the check.");
                        }

                        if(missingGuilds.length > 0) {
                            if(verbose === 2) {
                                message.channel.send("Starting to add the missing guilds into the database...");
                            }
                            
                            const addMissingGuilds = () => {
                                missingGuilds.forEach(guild => {
                                    const keys = `id, name, message_wlcm, message_dm_wlcm, message_leave, wlcm_channel_id, leave_channel_id, etat_autorole, etat_msg_wlcm, etat_msg_leave, etat_dm_wlcm, prefix, premium, id_autorole`;
                                    const values = `$1, $2, null, null, null, null, null, false, false, false, false, null, 0, null`;
                        
                                    const request = `INSERT INTO guilds (${keys}) VALUES (${values})`;

                                    client.db.query(request, [guild.id, guild.name])
                                        .catch(error => message.channel.send(`Enable to add ${guild.name} to the database:\`\`\`js\n${error}\`\`\``));
                                });

                            };

                            await addMissingGuilds();

                            if(verbose > 0) {
                                message.channel.send(":white_check_mark: All missing guilds have been added to the database.");
                            }
                        }

                        else if(verbose > 0) {
                            message.channel.send(":white_check_mark: There's not guild missing in the database.");
                        }

                    })
                    .catch(error => {
                        console.log(error);
                        
                        if(verbose === 2) {
                            msg.edit(`:x: An error occured while recovering the ids: \`\`\`js\n${error}\`\`\``);
                        }
                    });
            }
        }

        else {
            const timeLeft = Math.round((now - this.cooldown) / 100) / 10;
            message.channel.send(client.resultEmbed(client.color.fail, `Vous devez attendre encore ${timeLeft}s avant de pouvoir utiliser la commande à nouveau.`));
        }
	},

	cooldownDuration: 10000,

	cooldown: 0
};