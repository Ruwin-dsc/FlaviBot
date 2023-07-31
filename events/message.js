const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch")

const p = new Map();
const m = new Map();
let language = "";
/**
 * Runs when somone sends a message in a server the bot is in
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
     * @param {Message} message
     */
    async run(message) {
        try {
            // prevent from other bots
            if (message.author.bot) return;

            if (message.guild) {


                let testlanguage = await this.client.db.query(`SELECT lang FROM guilds WHERE id='${message.guild.id}'`).then(async ({ rows }) => await rows[0]);

                testlanguage ? testlanguage : testlanguage = "french";

                if (testlanguage.lang === "french") language = this.client.langs.french;
                else if (testlanguage.lang === "english") language = this.client.langs.english;

            }

            // prevent from MP
            if (/https:\/\/discord(app)?\.com\/channels\/@me/gi.test(message.content)) {
                return;
            }
            /*
        // discord link for image, older messages or embed
        if(/https:\/\/discord(app)?\.com\/channels(\/\d+){3}/gi.test(message.content)) {
            this.retrieveEmbed(message);
        }*/


            const userMentioned = (new RegExp(`^<@(&|!)?${this.client.user.id}>$`)).test(message.content);

            // the bot was mentioned
            if (userMentioned && message.guild.me.hasPermission("SEND_MESSAGES")) {
                this.whenImMentioned(message);
            }



            // private messages
            if (message.channel.type === "dm") {
                this.privateMessage(message);
            }


            // if message is on a guild
            else if (message.guild) {



                await this.guildMessage(message);

            }


            this.treatMessageCommand(message);
        }

        catch (error) {
            // if any error occured, it will send a message to prevent the user
            console.log('Error onMessage: ', error);

            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Error')
                .setColor(this.client.color.orange)
                .setDescription('**Message:** `' + message.content.replace(/`/g, '\\`') + '`\n```js\n' + error + '```')
                .setFooter(message.guild?.name || `Direct Messages with ${message.author.tag}`, message.guild?.iconURL({ format: 'png', dynamic: true }) || message.author.displayAvatarURL({ dynamic: true }));


            const embed2 = new MessageEmbed()
                .setTitle('Erreur')
                .setColor(this.client.color.orange)
                .setDescription('Une erreur est survenue.\nVous pouvez signaler ce bug aux développeurs sur le [serveur du support](https://discord.gg/rBvf3zP).');

            message.channel.send(embed2);
            this.client.wh.logsErrors.send(embed).catch(e => console.error('message WebHook error'));
        }


    }










    /**
     * When a message has been sent in a guild
     * @param {Message} message message's object
     */
    async guildMessage(message) {

        let messageArray = message.content.split(' ');
        let command = messageArray[0];
        let args = messageArray.slice(1).map(arg => arg.trim()).filter(arg => arg.length > 0);

        if (message.content.startsWith("flavi ".toLowerCase())) {
            try {

                let url = `https://some-random-api.ml/chatbot?message=${args[0] ? args.slice(0).join("%20") : "coucou"}`

                await fetch(url)
                    .then(res => res.json())
                    .then(json => {
                        const embed = new MessageEmbed()
                            .setColor(this.client.color.blue)
                            .setAuthor(`Flavi`, this.client.user.displayAvatarURL())
                            .setDescription(json.response)
                        message.channel.send(embed)
                    })

            } catch (err) {

                console.log(err)
            }

        }

        this.client.volume.ensure(`${message.guild.id}`, {
            guild: message.guild.id,
            volume: 1
        });

        if (message.guild.id !== "646052160878018561" && !p.has(message.author.id)) {
            const commands = this.client.commands.map(c => c.name);
            const aa01 = 0;

            for (let i = 0; i < commands.length; i++) {
                if (message.content.includes(commands)) {
                    aa01 = 1;
                    break;
                }
            }

            if (aa01 === 0 && message.content.length >= 3) {
                p.set(message.author.id);

                this.client.setTimeout(() => {
                    p.delete(message.author.id);
                }, 5000);

                this.client.points.ensure(`${message.guild.id}-${message.author.id}`, {
                    user: message.author.id,
                    guild: message.guild.id,
                    points: 0,
                    level: 1
                });

                const key = `${message.guild.id}-${message.author.id}`;
                const r = Math.floor(message.content.length <= 60 ? Math.random() * 60 : Math.random() * 3);
                const pts = this.client.points.get(key, "points");

                this.client.points.set(key, parseInt(pts) + r, "points");

                const lvl = parseInt(this.client.points.get(key, "level") - 1);

                const nextLvl = (5 * Math.pow(lvl, 2) + (50 * lvl) + 100)



                if (nextLvl <= this.client.points.get(key, "points")) {
                    this.client.points.set(key, parseInt(this.client.points.get(key, "level")) + 1, "level");
                    this.client.points.set(key, 0, "points");

                    const etat_lvl = await this.client.db.query(`SELECT etat_msg_lvl FROM guilds WHERE id='${message.guild.id}'`);
                    const lvl_channel_id = await this.client.db.query(`SELECT lvl_channel_id FROM guilds WHERE id='${message.guild.id}'`);
                    const message_lvl = await this.client.db.query(`SELECT message_lvl FROM guilds WHERE id='${message.guild.id}'`);


                    if (etat_lvl.rows[0].etat_msg_lvl === true) {

                        const salon = message.guild.channels.cache.get(lvl_channel_id.rows[0].lvl_channel_id);

                        const r = {
                            user: message.author.username,
                            tag: message.author.tag,
                            mention: `<@${message.author.id}>`,
                            level: parseInt(this.client.points.get(key, "level"))
                        };

                        let messageModif = "";
                        if (message_lvl !== null) {
                            messageModif = message_lvl.rows[0].message_lvl.replace(/(\{(user|tag|mention|level)\})/g, (c, p1, p2) => r[p2])
                        }



                        if (lvl_channel_id.rows[0].lvl_channel_id === null || salon) {
                            salon.send(messageModif);
                        }

                        if (message.guild.id === "696743688910667837") {
                            const role_reward = {
                                "1": "7718526888980512849",
                                "2": "710110519192977469",
                                "5": "710110170830864555",
                                "10": "724181314353496166",
                                "15": "710111508142620693",
                                "20": "734898491289239562",
                                "25": "724181618771623938",
                                "30": "752807499232706590",
                                "35": "752807501962936361",
                                "40": "752807505188618261",
                                "45": "752810053022777385",
                                "50": "752810050200010912",
                            }

                            const niv_role = role_reward[parseInt(this.client.points.get(key, "level"))];

                            if (niv_role) {
                                const role = message.guild.roles.cache.get(niv_role);

                                if (role) {
                                    message.member.roles.add(role.id);
                                }

                            }
                        }

                    }
                }


            }
        }
    }










    /**
     * When someone has DM the bot
     * @param {Message} message message's object
     */
    privateMessage(message) {
        const embed = new MessageEmbed()
            .setColor(this.client.color.cyan)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Commande :** \`\`\`${message.content}\`\`\``)
            .setTimestamp();

        this.client.wh.logsDM.send(embed).catch(e => console.error('DM WebHook error'));
    }







    /**
     * If someone send a message's link
     * @param {Message} message message's object
     */
    retrieveEmbed(message) {
        const match = message.content.match(/https:\/\/discord(app)?\.com\/channels\/\d+\/\d+\/\d+/);

        if (!match) return;

        const splitmessage = match[0].split('/');


        const idchannel = splitmessage[5];
        const channel = this.client.channels.cache.get(idchannel);

        // cannot read the channel
        if (channel === undefined) return;

        // cannot read from NSFW channels
        if (channel.nsfw) return;


        const idmessage = splitmessage[6];

        channel?.messages?.fetch(idmessage)
            .then(msg => {
                let embed = new MessageEmbed()
                    .setColor(this.client.color.blue)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }));

                if (msg.attachments.size !== 0) {

                    if (msg.content.length > 0) {
                        embed.setDescription(msg.content);
                    }

                    const attachment = msg.attachments.first();
                    // image
                    if (/\.(png|gif|png|jp(e)?g)$/i.test(attachment.name)) {
                        embed.setImage(attachment.url);
                    }

                    // file
                    else {
                        const { humanFileSize } = client.loadModule('utils');

                        let size = attachment.size;

                        try {
                            size = humanFileSize(attachment.size);
                        } catch (e) { }

                        embed
                            .addField('File type :', attachment.name.split('.').slice(-1)[0])
                            .addField('File name :', attachment.name)
                            .addField('File size :', size)
                            .addField('File link :', attachment.url);

                        client.removeModule('utils');
                    }

                }

                else if (msg.embeds.length !== 0) {
                    // embeds
                    embed = msg.embeds[0];
                }

                else {
                    // simple message
                    embed.setDescription(msg.content);

                }

                message.channel.send({ embed });
            });
    }





    /**
     * Watch if user has written a bot'scommand
     * @param {Message} message
     */
    async treatMessageCommand(message) {
        const mentionRegex = new RegExp(`^<@(!|&)?${this.client.user.id}>`);

        let prefix;

        if (message.guild) {
            prefix = this.client.prefixes[message.guild.id];
        }

        // must start with the bot's prefix, or mentionning the bot
        if (!message.content.startsWith(prefix) && !mentionRegex.test(message.content.trim())) return;

        let content;

        if (message.content.startsWith(prefix)) {
            // get message content without the prefix
            content = message.content.slice(prefix.length).trim();
        } else {
            // get message content without the bot mention
            content = message.content.replace(/^\s*<@(!|&)?\d+>/, '').trim();
        }

        // get message's command and message's arguments
        let messageArray = content.split(' ');
        let command = messageArray[0];
        let args = messageArray.slice(1).map(arg => arg.trim()).filter(arg => arg.length > 0);


        // try to get the command
        let commandObj = this.client.commands.get(command);

        // if the command was found
        if (commandObj) {
            this.executeCommand(message, commandObj, args, language);
        }


        // else look for aliases
        else {
            let commandAlias = this.client.aliases.get(command);

            // it's an alias
            if (commandAlias) {
                commandObj = this.client.commands.get(commandAlias);
                this.executeCommand(message, commandObj, args, language);
            }
        }
    }





    /**
     * If someone has mentioned the bot
     * @param {Message} message message's object
     */
    whenImMentioned(message) {

        const msgEmbed = new MessageEmbed()
            .setColor(this.client.color.blue)
            .setDescription(`${language.FLAVIBOT_MENTION.replace("{prefix}", this.client.prefixes[message.guild.id])}`);

        message.channel.send(msgEmbed);
    }




    /**
     * Execute the given command
     * @param {Message} message
     * @param {Object} cmd
     * @param {array<string>} args
     */
    async executeCommand(message, cmd, args) {
        // disabled command
        if ('disabled' in cmd && cmd.disabled === true && !this.client.isDev(message.author.id)) {
            return message.channel.send('La commande est désactivée');
        }

        // guild only command
        else if ('guildOnly' in cmd && cmd.guildOnly && message.channel.type == 'dm') {
            message.channel.send('Cette commande ne peut être utilisée que sur un serveur');
        }

        // command restricted to bot developers
        else if ('restricted' in cmd && cmd.restricted === true && !this.client.developers.includes(message.author.id)) {
            return;
        }

        else if ('inDev' in cmd && cmd.inDev === true && !this.client.isDev(message.author.id)) {
            message.channel.send(this.client.resultEmbed(this.client.color.blue, "<a:chargement:727228583310917734> En développement..."));
        }

        else if ('premium' in cmd && cmd.premium === true && (await this.client.db.query(`SELECT premium FROM guilds WHERE id='${message.guild.id}'`).then(data => (data?.rows[0]?.premium || 0) >= 1 ? true : false)) === false) {
            message.channel.send(this.client.resultEmbed(this.client.color.fail, `:x: Il semblerait que ce serveur ne possède pas le Premium.\n\nVous voulez le Premium ?\nRendez vous sur [flavibot.xyz/premium](https://flavibot.xyz/premium)`));
        }

        //
        else {

            // check if the bot has the required permissions for executing the command on this channel / server
            let hasRequiredPerms = true;

            if (message.channel.type != 'dm') {
                // must send messages in the channel
                if (message.guild && !message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                    return true
                }


                // must send embed in the channel
                if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
                    return message.channel.send(`${language.MISSING_BOT_PERMISSION_EMBED}`);
                }





                let perm;

                /// CHECK BOT PERMS
                if (cmd.permissions) {
                    //  check if the bot has each required permissions for the command

                    cmd.permissions.forEach(permission => {
                        if (!message.channel.permissionsFor(message.guild.me).has(permission)) {
                            perm = permission;
                            hasRequiredPerms = false;
                        }
                    });

                    // don't fill all required permissions
                    if (!hasRequiredPerms) {
                        return message.channel.send(this.client.errorEmbed(`${language.MISSING_BOT_PERMISSION.replace("{perm}", perm)}`));
                    }
                }



                // CHECK USER PERMS
                if (cmd.userPerms) {
                    perm = null;
                    hasRequiredPerms = true;

                    // foreach perm
                    if (cmd.userPerms.includes('DEV') && this.client.developers.includes(message.author.id)) {
                        // DEV has all rights
                    }

                    else {

                        cmd.userPerms.forEach(permission => {
                            if (permission != 'DEV' && !message.channel.permissionsFor(message.author).has(permission)) {
                                perm = permission;
                                hasRequiredPerms = false;
                            }
                        });

                        // don't fill all required permissions
                        if (!hasRequiredPerms) {

                            const embed = this.client.createEmbed(this.client.color.red, message, true)
                                .setDescription(`${language.MISSING_USER_PERMISSION.replace("{usage}", this.client.prefixes[message.guild.id] + cmd.name).replace("{perm}", perm)}`)

                            return message.channel.send(embed);
                        }

                    }
                }
            }






            // else run it & count it in stats

            // get it / create it if not defined
            this.client.commandStats.ensure(`${cmd.id}`, {
                id: cmd.id,
                uses: 0
            });

            if (!cmd.inDev) {
                // increment it
                this.client.commandStats.inc(`${cmd.id}`, 'uses');
            }



            // RUN it
            cmd.run(this.client, message, language, args);





            // logs executed command
            const guildIconUrl = message.guild ? message.guild.iconURL() : "https://flavibot.xyz/public/images/noticon.png";
            const guildName = message.guild ? message.guild.name : 'Direct Messages';

            const embed = new MessageEmbed()
                .setColor(this.client.color.cyan)
                .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Commande :** \`\`\`${message.content}\`\`\``)
                .setTimestamp()
                .setFooter(`${guildName} | ${message.guild ? message.guild.id : "nop id"}`, guildIconUrl);

            this.client.wh.logsCommands.send(embed).catch(e => console.error('executeCommand WebHook error'));
        }
    };
}

