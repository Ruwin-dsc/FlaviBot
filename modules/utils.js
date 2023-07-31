const path = require('path');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    /**
     * Check either the given command is well formed or not
     * @param {class} command
     * @return {boolean}
     */
    isCommand: command => {
        // must be an object (a class) and not null
        if (typeof command !== 'object' || command === null) {
            return false;
        }

        // command props that MUST exist
        const commandRequires = ['name', 'run', 'id'];

        let ok = true;

        commandRequires.forEach(prop => {
            if (prop in command === false) {
                ok = false;
            }
        });

        return ok;
    },

    /**
     * Returns the total guild number counting all shards
     * @param {Client} client
     * @return {number}
     */
    guildNumber: async client => {
        return await client.shard.fetchClientValues('guilds.cache.size').then(guild => guild.reduce((prev, guildCount) => prev + guildCount, 0)).catch(err => 0);
    },

    // all Discord regions with emoji
    regions: {
        "brazil": ":flag_br: Brazil",
        "europe": ":flag_eu: Europe",
        "eu-west": ":flag_eu: Western Europe",
        "eu-central": ":flag_eu: Central Europe",
        "hong-kong": ":flag_hk: Hong Kong",
        "india": ":flag_in: India",
        "japan": ":flag_jp: Japan",
        "russia": ":flag_ru: Russia",
        "singapore": ":flag_sg: Singapore",
        "southafrica": ":flag_za:  South Africa",
        "sydney": ":flag_au: Sydney",
        "us-central": ":flag_us: U.S. Central",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam"
    },

    // all supported translation languages
    langs: [
        "afrikaans", "albanian", "amharic", "arabic",
        "armenian", "azerbaijani", "bangla", "basque",
        "belarusian", "bengali", "bosnian", "bulgarian",
        "burmese", "catalan", "cebuano", "chichewa",
        "corsican", "croatian", "czech", "danish",
        "dutch", "english", "esperanto", "estonian",
        "filipino", "finnish", "french", "frisian",
        "galician", "georgian", "german", "greek",
        "gujarati", "haitian creole", "hausa",
        "hawaiian", "hebrew", "hindi", "hmong",
        "hungarian", "icelandic", "igbo", "indonesian",
        "irish", "italian", "japanese", "javanese",
        "kannada", "kazakh", "khmer", "korean",
        "kurdish (kurmanji)", "kyrgyz", "lao", "latin",
        "latvian", "lithuanian", "luxembourgish", "macedonian",
        "malagasy", "malay", "malayalam", "maltese",
        "maori", "marathi", "mongolian", "myanmar (burmese)",
        "nepali", "norwegian", "nyanja", "pashto",
        "persian", "polish", "portugese", "punjabi",
        "romanian", "russian", "samoan", "scottish gaelic",
        "serbian", "sesotho", "shona", "sindhi",
        "sinhala", "slovak", "slovenian", "somali",
        "spanish", "sundanese", "swahili", "swedish",
        "tajik", "tamil", "telugu", "thai",
        "turkish", "ukrainian", "urdu", "uzbek",
        "vietnamese", "welsh", "xhosa", "yiddish",
        "yoruba", "zulu"
    ],

    /**
     * Returns a well formed timestamp
     * @param {number} date
     * @return {string}
     */
    checkDays: date => {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);

        return "(Il y a " + days + (days == 1 ? " jour" : " jours") + ")";
    },

    /**
     * Get the bot uptime as well formed timestamp
     * @param {number} seconds
     * @return {string}
     */
    getUptime: seconds => {
        const months = Math.floor(seconds / (2592000));
        seconds -= months * (2592000);

        const weeks = Math.floor(seconds / (604800));
        seconds -= weeks * (604800);

        const days = Math.floor(seconds / (86400));
        seconds -= days * (86400);

        const hours = Math.floor(seconds / (3600));
        seconds -= hours * (3600);

        const minutes = Math.floor(seconds / (60));
        seconds -= minutes * (60);

        const months_string = (0 < months) ? `${months} mois, ` : '';
        const weeks_string = (0 < weeks) ? `${weeks} semaine${weeks > 2 ? "s" : ""}, ` : '';
        const day_string = (0 < days) ? `${days} jour${days > 2 ? "s" : ""}, ` : '';
        const hours_string = (0 < hours) ? `${hours} heure${hours > 2 ? "s" : ""}, ` : '';
        const minutes_string = (0 < minutes || 0 < hours) ? `${minutes} minute${minutes > 1 ? "s" : ""}, ` : '';
        const seconds_string = `${Math.floor(seconds)} seconde${seconds > 2 ? "s" : ""} !`;

        return months_string + weeks_string + day_string + hours_string + minutes_string + seconds_string;
    },

    /**
     * Creates and returns the !stats embed
     * @param {Client} client
     * @param {Message} message
     * @return {MessageEmbed}
     */
    getPingEmbed: async (client, message = null) => {


        const { getUptime } = client.loadModule('utils');

        const uptime = getUptime(client.uptime / 1000);

        client.removeModule('utils');


        let values = await client.shard.broadcastEval(`
            [
                Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
                Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
            ]
        `);


        const RAMmax = values.map(x => x[0]).reduce((prev, ramCount) => prev + ramCount).toFixed(2);
        const RAMmax2 = values.map(x => x[1]).reduce((prev, ramCount) => prev + ramCount).toFixed(2);


        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
        ];


        let now = new Date();

        let annee = now.getFullYear();
        let mois = now.getMonth() + 1;
        let jour = now.getDate();
        let heure = now.getHours();
        let minute = now.getMinutes();

        return Promise.all(promises)
            .then(async results => {
                const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                let flav = await client.users.fetch("360783331962650624")
                let nox = await client.users.fetch("316639200462241792")
                let pioupia = await client.users.fetch("393084344077516811")

                const embed = new MessageEmbed()
                    .setColor(client.color.cyan)
                    .setTitle(`Status du FlaviBot`)
                    .addField(`Nombre de serveurs :`, `${totalGuilds}`, true)
                    .addField("Nombre d'utilisateurs :", `${totalMembers}`, true)
                    .addField("<:Developer:698564410180108339> Team FlaviBot :",
                        `Creator : **\`${flav.tag}\`**` +
                        `\nDevelopers Bot : **\`${flav.tag}\`, \`${nox.tag}\`, \`${pioupia.tag}\`**,` +
                        `\nDevelopers Website : **\`${flav.tag}\`, \`${pioupia.tag}\`**`, false)
                    .addField("Nombre de connexions vocales :", `${client.voice.connections.size}`, true)
                    .addField("Nombre de commandes :", `${client.commands.array().filter(cmd => !cmd.hidden).length}`, true)
                    .addField(":dividers: Node.js :", `${process.version}`, false)
                    .addField(":bar_chart: RAM", `${RAMmax}MB **/** ${RAMmax2}MB \n**(32Go Max)**`, true)
                    .addField(":clock3: Le bot est en ligne depuis :", `${uptime}\n\n:arrows_counterclockwise: **Dernière actualisation le ${jour}/${mois}/${annee} à ${heure}h${minute}**`, false);

                return embed;

            }).catch(err => {
                client.sendError(err, message ?? 'utils');
                return null;
            });
    },

    /**
     * Returns all sub direcotries of a folder
     * @param {string} folderPath
     * @return {array<string>}
     */
    getDirectories: folderPath => fs.readdirSync(folderPath).filter(file => fs.statSync(folderPath + path.sep + file).isDirectory()),

    /**
     * Convert bytes to human understandable size
     * @param {number} bytes
     * @param {boolean} si
     * @param {number} dp
     * @return {string}
     */
    humanFileSize: (bytes, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    }
};