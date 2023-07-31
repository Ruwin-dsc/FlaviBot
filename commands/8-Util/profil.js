const Canvas = require('canvas');
const {MessageAttachment, UserFlags, MessageEmbed} = require('discord.js');

/**
 * Shows member's profile
 */
module.exports = {
	id: 71,
    name: 'profil',
    aliases: ["profile"],
	description: `Voir son profil Discord`,
	arguments: `@mention`,
    permissions: ['ATTACH_FILES'],

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

    const canvas = Canvas.createCanvas(1000, 800);
    const ctx = canvas.getContext('2d');

    let userflags = await memberM.fetchFlags();

    const flags = new UserFlags(userflags.bitfield).serialize();

// console.log(flags)

        let perso = true

        if (memberM.presence.activities[0]?.type === "CUSTOM_STATUS" && memberM.presence.activities[0]?.state != null && !memberM.bot) {
            
                perso = memberM.presence.activities[0].state
            } else {
                perso = false
            } 
        

        if (memberM.presence.status === "offline") perso = false
        
        let remonte = false

        //       //Haut
        // ctx.fillStyle = '#212226';
        // ctx.fillRect(0, 0, 1000, 250);
        // //

        //Bas
        //  

        if (memberM.presence.status === "offline" && perso === false) {

            ctx.fillStyle = '#212226';
            ctx.fillRect(0, 0, 1000, 337);

            ctx.fillStyle = '#303136';
            ctx.fillRect(0, 338, 1000, 500);
    
        } else {
            //milieu
            ctx.fillStyle = '#212226';
            ctx.fillRect(0, 0, 1000, 337);

            ctx.fillStyle = '#303136';
            ctx.fillRect(0, 338, 1000, 800);

        }

    let spotify = false
    let game = false
    let customstatus = false
    let twitch = false

if (!memberM.bot) {
    // console.log(memberM.presence.activities)
    if (memberM.presence.activities[0]?.type === "CUSTOM_STATUS" && memberM.presence.activities[0]?.state != null) {
        customstatus = true
        //milieu
        ctx.fillStyle = '#212226';
        ctx.fillRect(0, 0, 1000, 500);
        //

        if (memberM.presence.activities[1]?.type === "LISTENING" && memberM.presence.activities[1]?.name === "Spotify") {
            spotify = true
            //Haut
            ctx.fillStyle = '#1db954';
            ctx.fillRect(0, 0, 1000, 250);
            //
            //milieu
            ctx.fillStyle = '#1cb050';
            ctx.fillRect(0, 250, 1000, 500);
            //
            //Bas
            ctx.fillStyle = '#303136';
            ctx.fillRect(0, 500, 1000, 300);
            //
    
            }

            if (memberM.presence.activities[1]?.type === "PLAYING") {
                game = true
                //Haut
                ctx.fillStyle = '#7289d9';
                ctx.fillRect(0, 0, 1000, 250);
                //
                //milieu
                ctx.fillStyle = '#6c82ce';
                ctx.fillRect(0, 250, 1000, 500);
                //
                //Bas
                ctx.fillStyle = '#303136';
                ctx.fillRect(0, 500, 1000, 300);
                //
        }

} else {
        if (memberM.presence.activities[0]?.type === "LISTENING" && memberM.presence.activities[0]?.name === "Spotify") {
        spotify = true
        //Haut
        ctx.fillStyle = '#1db954';
        ctx.fillRect(0, 0, 1000, 250);
        //
        //milieu
        ctx.fillStyle = '#1cb050';
        ctx.fillRect(0, 250, 1000, 500);
        //
        //Bas
        ctx.fillStyle = '#303136';
        ctx.fillRect(0, 500, 1000, 300);
        //

        } 
}


}

if (perso === false){
if (memberM.presence.activities[0]?.type === "PLAYING") {
    game = true
    //Haut
    ctx.fillStyle = '#7289d9';
    ctx.fillRect(0, 0, 1000, 250);
    //
    //milieu
    ctx.fillStyle = '#6c82ce';
    ctx.fillRect(0, 250, 1000, 500);
    //
    //Bas
    ctx.fillStyle = '#303136';
    ctx.fillRect(0, 500, 1000, 300);
    //
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'start'
    ctx.font = 'bold 28px discord';
    ctx.fillText(`EN TRAIN DE JOUER`, 50, 320);

    ctx.font = '23px discord'

    ctx.fillText(`${memberM.presence.activities[0]?.name}`, 50, 370);
}
}


    if (game === false) {
        if (spotify === false && memberM.presence.status === "online") {
        //milieu
        ctx.fillStyle = '#212226';
        ctx.fillRect(0, 0, 1000, remonte === true ? 320 : 337);
        
        //
        }

        if (spotify === false && memberM.presence.status === "offline") {
            //milieu
            ctx.fillStyle = '#212226';
            // ctx.fillRect(0, 0, 1000, 337);
            //
            }
        }
if (memberM.bot) {
            if (memberM.presence.activities[0]?.type === "PLAYING") {
            //Haut
            ctx.fillStyle = '#7289d9';
            ctx.fillRect(0, 0, 1000, 250);
            //
            //milieu
            ctx.fillStyle = '#6c82ce';
            ctx.fillRect(0, 250, 1000, 500);
            //
            //Bas
            ctx.fillStyle = '#303136';
            ctx.fillRect(0, 500, 1000, 300);
            //
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'start'
            ctx.font = 'bold 28px discord';
            ctx.fillText(`ENTRAIN DE JOUER`, 50, 320);

            ctx.font = '23px discord'

            ctx.fillText(`${memberM.presence.activities[0]?.name}`, 50, 370);

            } else if (memberM.presence.activities[0]?.type === "LISTENING") {

            //Haut
            ctx.fillStyle = '#7289d9';
            ctx.fillRect(0, 0, 1000, 250);
            //
            //milieu
            ctx.fillStyle = '#6c82ce';
            ctx.fillRect(0, 250, 1000, 500);
            //
            //Bas
            ctx.fillStyle = '#303136';
            ctx.fillRect(0, 500, 1000, 300);
            //
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'start'
            ctx.font = 'bold 28px discord';
            ctx.fillText(`ECOUTE ${memberM.presence.activities[0]?.name}`, 50, 320);

            ctx.font = '23px discord'

            ctx.fillText(`ecoute ${memberM.presence.activities[0]?.name}`, 50, 370);
            } else if (memberM.presence.activities[0]?.type === "WATCHING") {

                //Haut
                ctx.fillStyle = '#7289d9';
                ctx.fillRect(0, 0, 1000, 250);
                //
                //milieu
                ctx.fillStyle = '#6c82ce';
                ctx.fillRect(0, 250, 1000, 500);
                //
                //Bas
                ctx.fillStyle = '#303136';
                ctx.fillRect(0, 500, 1000, 300);
                //
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'start'
                ctx.font = 'bold 28px discord';
                ctx.fillText(`REGARDE ${memberM.presence.activities[0]?.name}`, 50, 320);
            } else if (memberM.presence.activities[0]?.type === "STREAMING") {
                twitch = true

                //Haut
                ctx.fillStyle = '#593595';
                ctx.fillRect(0, 0, 1000, 250);
                //
                //milieu
                ctx.fillStyle = '#54338c';
                ctx.fillRect(0, 250, 1000, 500);
                //
                //Bas
                ctx.fillStyle = '#303136';
                ctx.fillRect(0, 500, 1000, 300);
                //
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'start'
                ctx.font = 'bold 28px discord';
                ctx.fillText(`EN DIRECT SUR TWITCH`, 50, 320);
            }
        }



    ctx.save();
                

    const phpcanvas = Canvas.createCanvas(150, 150);
    const phpctx = phpcanvas.getContext('2d');

    let img = await Canvas.loadImage(memberM.displayAvatarURL({ format: 'png' }));

    phpctx.drawImage(img, 0, 0, 150, 150);
    phpctx.arc(75, 75, 75, 0, Math.PI * 2);
    phpctx.globalCompositeOperation = 'destination-in'
    phpctx.fill();
    phpctx.globalCompositeOperation = 'destination-out'
    phpctx.beginPath();
    phpctx.arc(130, 130, 30, 0, Math.PI * 2);
    phpctx.fill();
    phpctx.beginPath();
            
    ctx.drawImage(phpcanvas, 50, 50, 150, 150);


    //status
        if (spotify === true || game == true) {
            ctx.fillStyle = '#ffffff';
        } else {
        ctx.fillStyle = ({
            online: '#43b581',
            offline: '#747f8d',
            idle: '#faa61a',
            dnd: '#f04747'
        })[memberM.presence.status];
        }

    ctx.beginPath();  
    ctx.arc(180, 180, 20, 0, 2 * Math.PI);
    ctx.fill();



    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'start'
    ctx.font = '30px discord';


    let badgeCount = []

    let i = -1;
    if (flags.DISCORD_EMPLOYEE) {
        badgeCount.push("1")
         i++;
        const DISCORD_EMPLOYEE = await Canvas.loadImage(`${client.root}/images/DiscordStaff.png`);
        ctx.drawImage(DISCORD_EMPLOYEE, 235 + (60*i), 135, 45, 45);
    };


    if (flags.DISCORD_PARTNER) {
        badgeCount.push("2")
        const DISCORD_PARTNER = await Canvas.loadImage(`${client.root}/images/DiscordPartner.png`);
        i++;
        ctx.drawImage(DISCORD_PARTNER, 235 + (60*i), 135, 45, 45);
    };

    if (flags.HYPESQUAD_EVENTS) {
        badgeCount.push("3")
        const HYPESQUAD_EVENTS = await Canvas.loadImage(`${client.root}/images/HypeSquad.png`);
        i++;
        ctx.drawImage(HYPESQUAD_EVENTS, 235 + (60*i), 135, 45, 45);
    };

    if (flags.HOUSE_BRILLIANCE) {
        badgeCount.push("4")
        const HOUSE_BRILLIANCE = await Canvas.loadImage(`${client.root}/images/hs-brilliance.png`);
        i++;
        ctx.drawImage(HOUSE_BRILLIANCE, 235 + (60*i), 135, 45, 45);
    };

    if (flags.HOUSE_BRAVERY) {
        badgeCount.push("5")
        const HOUSE_BRAVERY = await Canvas.loadImage(`${client.root}/images/hs-bravery.png`);
        i++;
        ctx.drawImage(HOUSE_BRAVERY, 235 + (60*i), 135, 45, 45);
    };

    if (flags.HOUSE_BALANCE) {
        badgeCount.push("6")
        const HOUSE_BALANCE = await Canvas.loadImage(`${client.root}/images/hs-balance.png`);
        i++;
        ctx.drawImage(HOUSE_BALANCE, 235 + (60*i), 135, 45, 45);
    };

    if (flags.BUGHUNTER_LEVEL_2) {
        badgeCount.push("7")
        const BUGHUNTER_LEVEL_2 = await Canvas.loadImage(`${client.root}/images/bug-hunter-2.png`);
        i++;
        ctx.drawImage(BUGHUNTER_LEVEL_2, 235 + (60*i), 135, 45, 45);
    };

    if (flags.BUGHUNTER_LEVEL_1) {
        badgeCount.push("8")
        const BUGHUNTER_LEVEL_1 = await Canvas.loadImage(`${client.root}/images/bug-hunter-1.png`);
        i++;
        ctx.drawImage(BUGHUNTER_LEVEL_1, 235 + (60*i), 135, 45, 45);
    }

    if(flags.VERIFIED_DEVELOPER) {
        badgeCount.push("10")
        const VERIFIED_DEVELOPER = await Canvas.loadImage(`${client.root}/images/Developer.png`);
        i++;
        ctx.drawImage(VERIFIED_DEVELOPER, 235 + (60*i), 140, 40, 40);
    }

    if (flags.EARLY_SUPPORTER) {
        badgeCount.push("9")
        const EARLY_SUPPORTER = await Canvas.loadImage(`${client.root}/images/early-supporter.png`);
        i++;
        ctx.drawImage(EARLY_SUPPORTER, 235 + (60*i), 135, 45, 45);
    };

    let booster = message.guild.roles.cache.filter(x => x.managed && x.hoist).map(e => e.id)[0]
    let memberM2 = message.guild.member(memberM)

    let isGuild 

    if(message.guild.members.cache.get(memberM.id) === undefined) {
        isGuild = false
    } else {
        isGuild = true
    }

    if (memberM.avatar != null && memberM.avatar.startsWith("a_") || memberM2?.roles.cache.has(booster) || memberM.discriminator === "0001") {
        badgeCount.push("11")
        const NITRO = await Canvas.loadImage(`${client.root}/images/nitro.png`);
        i++;
        ctx.drawImage(NITRO, 230 + (60*i), 135, 50, 50);
    }


    

    if (isGuild && memberM2.roles.cache.has(booster) ) {
        badgeCount.push("12")
        const NITRO_BOOST = await Canvas.loadImage(`${client.root}/images/Boost1month.png`);
        i++;
        ctx.drawImage(NITRO_BOOST, 235 + (60*i), 135, 50, 50);
    }

    ctx.font = 'bold 30px discord';

    let text = ctx.measureText(`${memberM.username}`).width + 1;

    ctx.font = '30px discord';

    let text2 = ctx.measureText(`#${memberM.discriminator}`).width;

    ctx.font = 'bold 30px discord';
    ctx.fillText(`${memberM.username}`, 235, badgeCount.length === 0 ? 140 : 120);

    ctx.font = '30px discord';
    ctx.fillStyle = '#dbdfdf';
    ctx.fillText(`#${memberM.discriminator}`, 236 + text, badgeCount.length === 0 ? 140 : 120);
    ctx.fillStyle = '#ffffff';

    if(memberM.bot) {
        if(flags.VERIFIED_BOT) {
            const VERIFIED_BOT = await Canvas.loadImage(`${client.root}/images/VerifiedBOT.png`);
            ctx.drawImage(VERIFIED_BOT, 245 + text + text2, 108, 110, 45)
        } else {
            const botbadge = await Canvas.loadImage(`${client.root}/images/bot.png`);
            ctx.drawImage(botbadge, 245 + text + text2, 108, 70, 45)
        }
         
    }


            if (perso === false) {
            remonte = true
                if (spotify === true) {
                    remonte === false
                }
                
                if (twitch === false || game === false || spotify === false) {
                } else {
                    ctx.fillRect(0, 250, 1000, 1);
                }
                    
            } else  {

                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'start'


                ctx.font = 'bold 28px discord';
                ctx.fillText(`STATUT PERSONNALISÉ`, 50, 320);


                if (twitch === false || game === false || spotify === false || twitch === false) {
                    ctx.font = '23px discord';
                } else {
                    ctx.font = 'bold 23px discord';
                }

                ctx.fillStyle = spotify || game ? '#ffffff' : '#b7b7bd';
                ctx.textAlign = 'start'

                let persoWidth = ctx.measureText(`${perso}`).width;

                // console.log(persoWidth)
                ctx.fillText(`${perso}`, 50, 370);
                
                ctx.fillRect(0, 415, 1000, 1);

            }
            
            if (!memberM.bot) {
                // if (remonte === true)
                
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'start'
                ctx.font = '28px discord';

                let barre = ctx.measureText(`Infos utilisateur`).width;
                let barre2 = ctx.measureText(`Serveur en commun`).width;
                let barre3 = ctx.measureText(`Amis en commun`).width;

                ctx.fillText(`Infos utilisateur`, 62.5, memberM.presence.status === "offline" || remonte === true && game === false && perso === false && spotify === false && twitch === false? 320 : 480);
                ctx.fillRect(62.5, memberM.presence.status === "offline" || remonte === true && game === false && perso === false && spotify === false && twitch === false? 337 : 497, barre, 3);

                ctx.fillText(`Serveur en commun`, 345, memberM.presence.status === "offline" || remonte === true && game === false && perso === false && spotify === false && twitch === false? 320 : 480);//480
                // ctx.fillRect(345, 497, barre2, 3);

                ctx.fillText(`Amis en commun`, 693.5, memberM.presence.status === "offline" || remonte === true && game === false && perso === false && spotify === false && twitch === false? 320 : 480);
                // ctx.fillRect(693.5, 497, barre3, 3);

                function roundRect(x, y, w, h, radius) {

                var r = x + w;
                var b = y + h;
                ctx.beginPath();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = "0.3";
                ctx.moveTo(x+radius, y);
                ctx.lineTo(r-radius, y);
                ctx.quadraticCurveTo(r, y, r, y+radius);
                ctx.lineTo(r, y+h-radius);
                ctx.quadraticCurveTo(r, b, r-radius, b);
                ctx.lineTo(x+radius, b);
                ctx.quadraticCurveTo(x, b, x, b-radius);
                ctx.lineTo(x, y+radius);
                ctx.quadraticCurveTo(x, y, x+radius, y);
                ctx.stroke();
                }

                if (memberM.presence.status == "offline" || remonte === true && game === false && perso === false && spotify === false && twitch === false) {
                    ctx.fillRect(0, 250, 1000, 1)
                
                    roundRect(60, 400, 400, 120, 5)
                    roundRect(60, 550, 400, 120, 5)
                    roundRect(540, 400, 400, 120, 5)
                    roundRect(540, 550, 400, 120, 5)
                } else {
                    roundRect(60, 550, 400, 83, 5)
                    roundRect(60, 680, 400, 83, 5)
                    roundRect(540, 550, 400, 83, 5)
                    roundRect(540, 680, 400, 83, 5)
                }


            } else {

                let barre4 = ctx.measureText(`Serveurs en commun`).width;

                ctx.fillText(`Serveurs en commun`, 62.5, 480);
                ctx.fillRect(62.5, 497, barre4, 3);
                ctx.fillRect(0, 410, 1000, 1);
            }

             


            const attachment = new MessageAttachment(canvas.toBuffer(), 'Profil.png');
            return message.channel.send(attachment); 


	}
};
        // // avatar picture
        // let img = await Canvas.loadImage(memberM.displayAvatarURL({ format: 'png' }));

        // // avatar + status
        // ctx.save();
        //     ctx.translate(50, 50)
        //     // avatar
        //     ctx.save();
        //         ctx.beginPath();
        //         ctx.arc(75, 75, 75, 0, 2 * Math.PI);
        //         ctx.closePath();
        //         ctx.clip();

        //         ctx.drawImage(img, 0, 0, 150, 150);
        //     ctx.restore();

        //     // bg color circle to make separation between picture and status circle
        //     ctx.fillStyle = "#212226";

        //     ctx.beginPath();
        //     ctx.arc(130, 130, 30, 0, 2 * Math.PI);
        //     ctx.closePath();
        //     ctx.fill();

        //     // status
        //     ctx.fillStyle = ({
        //         online: '#43b581',
        //         offline: '#747f8d',
        //         idle: '#faa61a',
        //         dnd: '#f04747'
        //     })[memberM.presence.status];

        //     ctx.beginPath();
        //     ctx.arc(180, 180, 20, 2 * Math.PI);
        //     ctx.closePath();
        //     ctx.fill();

        // ctx.restore();