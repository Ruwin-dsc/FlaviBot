const Discord = require('discord.js');
const Util = require('util');
const fs = require('fs');
const math = require('mathjs');
const ms = require('ms');
const path = require('path');
const pm2 = require('pm2');
const process = require('process');

/**
 * Eval Javascript - restricted to Bot developers
 */
module.exports = {
	id: 3,
	name: 'eval',
	restricted: true,
	hidden: true,
	
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {array<string>} args
	 */
	run(client, message, language, args) {
		
		if(args.length == 0) {
			const embed = client.resultEmbed(client.color.red, message, true)
				.setDescription(`:x: Oh oH Oooohhhh :(`)
			return message.channel.send(embed)
		}
		
		
		const send = msg => message.channel.send(msg);
		const execute = (cmd, ...args) => client.commands.get(cmd)?.run(client, message, args) || undefined;
				
		const cleanAfter = text => {
			if(typeof text == 'string') {
				client.forbiddenWords.forEach(key => {
					const reg = new RegExp(key, 'g');

					text = text.replace(reg, '');
				});

				text = text.trim();
			}
			
			else if(typeof text == 'object') {
				for(let i of Object.keys(text)) {
					if(typeof text[i] == 'string') {
						client.forbiddenWords.forEach(key => {
							const reg = new RegExp(key, 'g');
		
							text[i] = text[i].replace(reg, '');
						});
					}
				}
			}

			return text;
		};

		const cleanBefore = text => {
			let cleanText = text.replace(/client\.(token|forbiddenWords)/g, '');
			
			if(/await/.test(cleanText)) {
				cleanText = `(async () => {${cleanText}})()`;
			}

			return cleanText;
		};
				

		let code = args.join(" ").trim();
	
		
		let lang = (code.length > 0 ? 'js' : '') + '\n';

		// output embed
		const embed = new Discord.MessageEmbed()
			.setColor(client.color.cyan)
				
			let desc = "📥 **Tested code**\n```" + lang + code + "```\n";
		

			// try execute the code. If no errors, then stocks the result
			try {
				let evaluated = Util.inspect(cleanAfter(eval(cleanBefore(code))), {depth: 1});
				
				if(evaluated.length > 1000) {
					evaluated = evaluated.slice(0, 1000) + '\n\t// ...\n}';
				}
				
				lang = (evaluated.length > 0 ? 'js' : '') + '\n';
				
				desc += "📤 **Result**\n```" + lang + evaluated + "```";
			}
	
			// else stocks the error
			catch (error) {
				desc += "📤 **Error**\n```" + lang + error + "```";
			}
		
			embed.setDescription(desc);

			// then print the final result
			send(embed);


	}
};