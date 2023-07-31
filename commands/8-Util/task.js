const { MessageEmbed } = require('discord.js');

/**
 * Task manager
 */
module.exports = {
	id: 69,
	name: 'task',
	description: `Gestionnaire des tâches du bot`,
	arguments: `create <taskName> <Description> | delete <taskName> | detail <taskName> | None`,
    restricted: true,
    hidden: true,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {
        
        // no arguments: just show all tasks
        if(args.length === 0) {
            this.listAll(client, message);
        }

        else if(args.length == 1 && args[0] == 'help') {
            message.channel.send(client.createEmbed(client.color.blue, message).addField('Usage :', this.usage));
        }

        // create a new task
        else if(args[0] == 'create') {
            this.create(client, message, language, args);
        }

        // delete an existing task
        else if(args[0] == 'delete') {
            this.delete(client, message, language, args);
        }

        // change status
        else if(args[0] == 'status') {
            this.setStatus(client, message, language, args);
        }

        // focus a task
        else if(args[0] == 'focus') {
            this.setFocus(client, message, language, args);
        }

        // leave the focus of a task
        else if(args[0] == 'leave') {
            this.leaveFocus(client, message, language, args);
        }

        else if(args[0] == 'me' && args.length == 1) {
            this.showFocusedTasks(client, message);
        }

        // details of a task
        else if(args.length == 1) {
            this.showDetails(client, message, language, args);
        }

    },
    

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string} arg
	 */
    getTask(client, message, arg) {
        let task = null;

        // by name
        if(isNaN(parseInt(arg))) {
            if(!client.tasks.has(arg)) {
                message.channel.send(client.resultEmbed(client.color.fail, ":x: Cette tâche n'existe pas."));
            }

            else {
                task = client.tasks.get(arg);
            }
        }

        // by index
        else {
            const i = parseInt(arg);
            
            if(i < 1 || i > client.tasks.size) {
                message.channel.send(client.resultEmbed(client.color.fail, ":x: Numéro de tâche incorrect."));
            }

            else {
                task = client.tasks.array()[i-1];
            }
        }

        return task;
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 */
    listAll(client, message) {
        const tasks = client.tasks.array().map((task, i) => `\`${i+1}\` • ${this.status[task.status]?.emoji} ${task.name}`).join('\n');

        const desc = (tasks == '')? 'Aucune tâche prévue' : tasks;

        const embed = new MessageEmbed()
            .setColor(client.color.fail)
            .setTitle(":ledger: Dev tasks :")
            .setDescription(desc);

        message.channel.send(embed);
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 */
    create(client, message, language, args) {
        if(args.length < 3) {
            return message.channel.send(client.resultEmbed(client.color.fail, ':x: Un nom de tâche et une description est attendue.'));
        }

        const taskName = args[1];
        const description = args.slice(2).join(' ');

        if(!/^[a-z][a-z_]{0,30}$/i.test(taskName)) {
            return message.channel.send(client.resultEmbed(client.color.fail, ':x: Le nom de la tâche est trop long ou comporte des caractères interdits.'));
        }

        if(client.tasks.has(taskName)) {
            return message.channel.send(client.resultEmbed(client.color.fail, ':x: Une tâche avec ce nom existe déjà.'));
        }

        client.tasks.set(taskName, {name: taskName, description, status: 'notstarted'});

        message.channel.send(client.resultEmbed(client.color.fail, ':inbox_tray: Tâche enregistrée'));
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    delete(client, message, language, args) {
        if(args.length == 1) {
            return message.channel.send(client.resultEmbed(client.color.fail, ':x: Au moins un nom de tâche est attendu.'));
        }
        
        if(!client.tasks.has(args[1])) {
            return message.channel.send(client.resultEmbed(client.color.fail, ":x: Cette tâche n'existe pas."));
        }

        client.tasks.delete(args[1]);

        message.channel.send(client.resultEmbed(client.color.fail, ':outbox_tray: Tâche supprimée.'));
    },

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    setStatus(client, message, language, args) {
        if(args.length != 3) {
            return message.channel.send(client.resultEmbed(client.color.fail, ":x: 2 arguments attendus."));
        }

        const task = this.getTask(client, message, language, args[1]);

        if(!task) return;
        
        const status = args[2].toLowerCase();

        if(!Object.keys(this.status).includes(status)) {
            return message.channel.send(client.resultEmbed(client.color.fail, ":x: Status inconnu."))
        }

        client.tasks.set(task.name, status, 'status');

        message.channel.send(client.resultEmbed(client.color.fail, `:white_check_mark: Status de la tâche ${task.name} mis à jour.`));
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    setFocus(client, message, language, args) {
        if(args.length < 2) {
            return message.channel.send(client.resultEmbed(client.color.fail, 'Précisez une tâche à focus.'));
        }

        for(let arg of args.slice(1)) {
            const task = this.getTask(client, message, arg);

            if(!task) continue;

            if('focus' in task) {
                message.channel.send(client.resultEmbed(client.color.fail, `:x: ${client.users.cache.get(task.focus).tag} est déjà sur cette tâche (${task.name}).`));
                continue;
            }

            client.tasks.set(task.name, message.author.id, 'focus');

            message.channel.send(client.resultEmbed(client.color.fail, `:round_pushpin: Vous focussez cette tâche (${task.name}).`));
        }
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    leaveFocus(client, message, language, args) {
        if(args.length != 2) {
            return message.channel.send(client.resultEmbed(client.color.fail, 'Précisez une tâche à arrêter de focus.'));
        }

        const task = this.getTask(client, message, language, args[1]);

        if(!task) return;

        if(!('focus' in task) || task.focus != message.author.id) {
            return message.channel.send(client.resultEmbed(client.color.fail, `:x: vous ne focussez pas cette tâche.`));
        }

        client.tasks.deleteProp(task.name, 'focus');

        message.channel.send(client.resultEmbed(client.color.fail, `:see_no_evil: Vous ne focussez plus cette tâche.`));
    },


    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
    showDetails(client, message, language, args) {
        const task = this.getTask(client, message, language, args[0]);

        if(!task) return;

        // to not get an error
        if(task) {
            let emoji = this.status[task.status]?.emoji || '';

            const embed = new MessageEmbed()
                .setColor(client.color.fail)
                .setTitle(`:pencil: Task: ${task.name}`)
                .addField('Description', task.description)
                .addField('Status', `${emoji} ${this.status[task.status]?.name}`);

            if('focus' in task) {
                embed
                    .addField('Focused by', client.users.cache.get(task.focus).tag)
                    .setThumbnail(client.users.cache.get(task.focus).displayAvatarURL({ dynamic: true }));
            }

            message.channel.send(embed);
        }
    },




    /**
	 * @param {Client} client
	 * @param {Message} message
	 */
    showFocusedTasks(client, message) {
        const tasks = client.tasks.array().filter(task => task.focus && task.focus == message.author.id).map((task, i) => `\`${i+1}\` • ${this.status[task.status]?.emoji} ${task.name}`).join('\n');

        const desc = (tasks == '')? 'Vous ne focussez aucune tâche' : tasks;

        const embed = new MessageEmbed()
            .setTitle(`:ledger::pushpin: Tasks focused by ${message.author.tag}`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(desc);

        message.channel.send(embed);
    },



    status: {
        notstarted: {emoji: ":x:", name: 'not started'},
        doing:      {emoji: "<a:chargement:727228583310917734>", name: 'in development'},
        done:       {emoji: ":white_check_mark:", name: 'fini'}
    }
};