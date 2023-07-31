const Canvas = require('canvas');
const utf8 = require('utf8');
const { MessageAttachment, MessageEmbed } = require('discord.js');

/**
 * Shows the level of a member in a guild
 */
module.exports = {
    id: 54,
    name: 'rank',
    // aliases: ["rank"],
    description: `Permet de voir le level d'une personne`,
    arguments: `@mention | id`,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {array<string>} args
     */
    async run(client, message, language, args) {

        const memberM = await client.getMember(message, args);

        if (!memberM) {

            // member not found
            const embedv = new MessageEmbed()
                .setColor(client.color.blue)
                .setDescription(`Utilisateur introuvable !`)
                .setTimestamp()
                .setFooter(client.footerT(message.guild.id), client.footerI())

            return message.channel.send(embedv);

        }

        if (memberM.bot) {
            return message.channel.send(`Les robots ne participe pas au levels...`)
        }


        client.points.ensure(`${message.guild.id}-${memberM.id}`, {
            user: memberM.id,
            guild: message.guild.id,
            points: 0,
            level: 1
        });

        function kFormatter(num) {
            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
        }

        // data
        const key = `${message.guild.id}-${memberM.id}`;

        const cExp = client.points.get(key, "points");
        const lvl = parseInt(client.points.get(key, "level"));

        const nextLvl = (5 * Math.pow(lvl, 2) + (50 * lvl) + 100)

        const prc = parseInt((cExp / nextLvl) * 100).toFixed(0);


        // output
        const canvas = Canvas.createCanvas(950, 300);
        const ctx = canvas.getContext('2d');

        const bgColor = '#23272A';
        const picX = 150, picY = 150, picR = 100;
        const statusR = 26;
        const sepSize = 14;

        const barColor = '#9d9d9d';
        const xpColor = '#007fff';
        const txtColor = '#fff';



        // canvas dark background
        ctx.fillStyle = bgColor;

        function roundRect(x, y, w, h, radius) {

            var r = x + w;
            var b = y + h;
            ctx.beginPath();
            ctx.strokeStyle = bgColor;
            ctx.lineWidth = "1";
            ctx.moveTo(x + radius, y);
            ctx.lineTo(r - radius, y);
            ctx.quadraticCurveTo(r, y, r, y + radius);
            ctx.lineTo(r, y + h - radius);
            ctx.quadraticCurveTo(r, b, r - radius, b);
            ctx.lineTo(x + radius, b);
            ctx.quadraticCurveTo(x, b, x, b - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.stroke();
            ctx.fill();
        }

        roundRect(0, 0, 950, 300, 25)

        ctx.save();

        const phpcanvas = Canvas.createCanvas(200, 200);
        const phpctx = phpcanvas.getContext('2d');

        let img = await Canvas.loadImage(memberM.displayAvatarURL({ format: 'png' }));

        phpctx.drawImage(img, 0, 0, 200, 200);
        phpctx.arc(100, 100, 100, 0, Math.PI * 2);
        phpctx.globalCompositeOperation = 'destination-in'
        phpctx.fill();
        phpctx.globalCompositeOperation = 'destination-out'
        phpctx.beginPath();
        phpctx.arc(174, 174, 40, 0, Math.PI * 2);
        phpctx.fill();
        phpctx.beginPath();

        ctx.drawImage(phpcanvas, 50, 50, 200, 200);

        //status

        // ctx.fillStyle = ({
        //     online: '#43b581',
        //     offline: '#747f8d',
        //     idle: '#faa61a',
        //     dnd: '#f04747'
        // })[memberM.presence.status];

        ctx.fillStyle = '#43b581';

        ctx.beginPath();
        ctx.arc(224, 224, 26, 0, 2 * Math.PI);
        ctx.fill();



        // xp bar

        ctx.fillStyle = barColor;

        const barre = 200;
        const demiCercle = 220;

        // left-side half-circle
        ctx.beginPath();
        ctx.arc(300, demiCercle, 20, -Math.PI / 2, Math.PI - Math.PI / 2, true);
        ctx.fill();
        ctx.closePath();

        // right-side half-circle
        ctx.beginPath();
        ctx.arc(800, demiCercle, 20, -Math.PI / 2, Math.PI - Math.PI / 2);
        ctx.fill();
        ctx.closePath();

        // xp rect bar
        ctx.fillRect(300, barre, 500, 40);




        // blue fill xp bar

        ctx.fillStyle = xpColor;


        // bar
        ctx.fillRect(300, barre, prc * 5, 40);

        // left-side half-circle
        ctx.beginPath();
        ctx.arc(300, demiCercle, 20, -Math.PI / 2, Math.PI - Math.PI / 2, true);
        ctx.fill();
        ctx.closePath();

        // left-side half-circle

        ctx.beginPath();
        ctx.arc(300 + prc * 5, demiCercle, 20, -Math.PI / 2, Math.PI - Math.PI / 2);
        ctx.fill();
        ctx.closePath();



        // data text output
        ctx.fillStyle = txtColor;

        // username
        ctx.textAlign = 'center';
        ctx.font = '40px sans-serif';
        const usernameSpace = ctx.measureText(`${memberM.username.slice(0, 20)}`).width;
        ctx.fillText(memberM.username.slice(0, 20), 550, 100);
        ctx.fillRect(550-(usernameSpace/2), 110, usernameSpace, 3);

        // level
        ctx.textAlign = 'start'
        ctx.font = '25px discord';
        ctx.fillText("Niveau : " + lvl, 300, 190);

        // xp
        const space = ctx.measureText(` / ${kFormatter(nextLvl)}/`).width;
        ctx.textAlign = 'end';
        ctx.fillStyle = txtColor;
        ctx.fillText(`${kFormatter(cExp)}`, 800 - space, 190);
        ctx.fillStyle = "#7b7f80";
        ctx.fillText(` / ${kFormatter(nextLvl)}`, 800  , 190);



        // % to next level
        ctx.fillStyle = txtColor;
        ctx.textAlign = 'center';
        ctx.font = '25px discord';
        ctx.fillText(`${prc}%`, 550, 230);

        // ctx.textAlign = 'end';
        // ctx.font = '40px discord';
        // ctx.fillText(`#1`, 900, 80);


        // send canvas
        const attachment = new MessageAttachment(canvas.toBuffer(), `level-${memberM.tag}.png`);
        return message.channel.send(`:star: Classement du serveur : <https://flavibot.xyz/leaderboard/${message.guild.id}>`, attachment);

    }
}
