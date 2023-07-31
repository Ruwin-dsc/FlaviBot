const Canvas = require('canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js');

/**
 * Show an example of the given hexadecimal color code
 */
module.exports = {
	id: 66,
	name: 'color',
	description: `Affiche un embed avec la couleur donnée`,
	arguments: `<couleur hexadecimale>`,

    /**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	async run(client, message, language, args) {

        if(args.length > 1) {
            return message.channel.send('Un seul argument accepté');
        }

        const reg = /^(0x|#)?(([0-9A-F]{3}){1,2})$/i;
        
        if(!reg.test(args[0])) {
            return message.channel.send("L'argument donné n'est pas une couleur hexadecimale.");
        }


        // transform it to has a # as first
        let colorhex =  args[0].replace(reg, '#$2');

        if(/^#(fff){1,2}$/i.test(colorhex)) {
            colorhex = '#fffffe';
        }

        // # + 3 char
        if(colorhex.length === 4) {
            colorhex = '#' + colorhex[1].repeat(2) + colorhex[2].repeat(2) + colorhex[3].repeat(2);
        }


        
        const canvas = Canvas.createCanvas(50, 30);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = colorhex
        ctx.fillRect(0, 0, 50, 30)

        const attachment = new MessageAttachment(canvas.toBuffer(), "color.png");

        const embed = new MessageEmbed()
            .attachFiles(attachment)
            .setColor(colorhex)
            .setTitle(colorhex)
            .setImage('attachment://color.png');

		message.channel.send(embed);

	}
};