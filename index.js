// requires
const config = require(`./config/config.json`);

const { ShardingManager } = require('discord.js');



// start shard manager
const manager = new ShardingManager(__dirname + '/FlaviBot.js', { token: config.discord.token, respawn: true, totalShards: "auto"});

manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));