// DATABASE

const Enmap = require("enmap");

/**
 * Create all enmaps
 * @param {Client} client
 */
module.exports = client => {
    // WARNS
    client.warn = new Enmap({name: "warn"});
    
    // POINTS
    client.points = new Enmap({name: "points"});
    
    // VOLUME
    client.volume = new Enmap({name: "volume"});
    
    // COMMANDS STATS
    client.commandStats = new Enmap({name: "commandstats"});

    // TASKS
    client.tasks = new Enmap({name: "tasks"});

    // POLLS
    client.polls = new Enmap({name: "polls"});
};