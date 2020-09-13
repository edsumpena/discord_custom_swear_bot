//require('dotenv').config();
const Discord = require('discord.js');
const request = require('request');
const secret = process.env;
const bot = new Discord.Client();

var custom = false;
var userCmd = false;
var customMsgs = [];

bot.login(process.env.BOT_TOKEN);

bot.on('ready', async guild => {
    bot.user.setActivity(`${bot.guilds.size} guilds | bit.ly/swear-bot`, {type: 'WATCHING'});
    console.log(`${bot.user.username} is ready!\nInvite => ${await bot.generateInvite(["ADMINISTRATOR"])}`);
});

bot.on("guildCreate", async guild => {
    bot.user.setActivity(`${bot.guilds.size} guilds | bit.ly/swear-bot`, {type: 'WATCHING'});
    let channel = bot.channels.get(guild.systemChannelID);
    if (!channel) return;
    let embed = new Discord.RichEmbed()
      .setColor('#'+(Math.random()*0xFFFFFF<<0).toString(16))
      .setTitle(`I am **${bot.user.username}**, and you better watch your mouth while im in **${guild.name}**`)
      .addField("Made by", "**(Lean)#1337**")
      .addField("Links", `[GitHub](https://github.com/TasosY2K/SwearBot)\n[Website](https://bot.ly/swear-bot)\n[Invite](${await bot.generateInvite(["ADMINISTRATOR"])})`)
    channel.send(embed);
});

bot.on("guildDelete", async guild => {
  bot.user.setActivity(`${bot.guilds.size} guilds | bit.ly/swear-bot`, {type: 'WATCHING'});
});

bot.on("message", async messages => {
    if (messages.author.bot) return;
    if (messages.channel.type === "dm") return;
		request(`https://www.purgomalum.com/service/containsprofanity?text=${messages.content.toString()}`, (err, res, body) => {
		if (body === "true") {
			if(message.substring(0, 1) == '!' && message.substring(1).split(' ')[0] == 'addCustomMsg' && (messages.member.hasPermission("ADMINISTRATOR") || userCmd)){
			} else {
			if(!custom){
				request(`https://insult.mattbas.org/api/insult`, (err, res, body) => {
				messages.reply(body);
				});
			} else {
				if(customMsgs.length != 0){
					var randIndex = Math.floor(Math.random() * customMsgs.length);
					messages.reply(customMsgs[randIndex]);
				}
			}
			}
		}
		});
	
	var message = messages.content.toString();
	if (message != undefined && message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
			case 'test':
                messages.reply('SwearBot is Connected!');
			break;
			case 'location':
				if (messages.channel.type === 'dm'){
					messages.reply('You are in DMs.');
				} else {
					messages.reply('You are in guild chat.');
				}
			break;
            case 'setCustomMsgs':
				if((messages.member != null && messages.member.hasPermission("ADMINISTRATOR")) || userCmd){
					if(args.length == 2 && (args[1] == 'true' || args[1] == 'false')){
						if(args[1] == 'true')
							custom = true;
						else if(args[1] == 'false')
							custom = false;
					
						if(custom)
							messages.reply('Bot now shows custom messages!');
						else
							messages.reply('Bot now shows generated messages!');
					} else {
						messages.reply('Invalid command syntax. Should be \"!setCustomMsgs <true/false>\"!')
					}
				} else {
					messages.reply('You must be a server admin to use this command!');
				}
            break;
			case 'addCustomMsg':
				if((messages.member != null && messages.member.hasPermission("ADMINISTRATOR")) || userCmd){
					if(message.indexOf(' "') != -1 && message.indexOf('"') != message.lastIndexOf('"')){
						var addedMsg = message.substring(message.indexOf(' "') + 2, message.lastIndexOf('"'));
						customMsgs.push(addedMsg);
						messages.reply('Successfully added custom message \"' + addedMsg + '\"!');
					} else {
						messages.reply('Invalid command syntax. Should be \"!addCustomMsg <"Your Message">\"!')
					}
				} else {
					messages.reply('You must be a server admin to use this command!');
				}
			break;
			case 'allowUserCmd':
				if ((messages.member != null && messages.member.hasPermission("ADMINISTRATOR"))){
					if(args.length == 2  && (args[1] == 'true' || args[1] == 'false')){
						if(args[1] == 'true')
							userCmd = false;
						else if(args[1] == 'false')
							userCmd = true;
					
						if(userCmd){
							messages.reply('Only server admins may call SwearBot commands now.');
						} else {
							messages.reply('All users may call SwearBot commands now.');
						}
					} else {
						messages.reply('Invalid command syntax. Should be \"!allowUserCmd <true/false>\"!');
					}
				} else {
					messages.reply('You must be a server admin to use this command!');
				}
			break;
			case 'customMsgList':
				if((messages.member != null && messages.member.hasPermission("ADMINISTRATOR")) || userCmd){
					var descrip = 'List of Custom Messages:\n';
					for(var i = 0; i < customMsgs.length; i++)
						descrip += (i + 1) + '. ' + customMsgs[i] + '\n';
					if(customMsgs.length == 0)
						descrip += 'No Custom Messages!';
					messages.reply(descrip);
				} else {
					messages.reply('You must be a server admin to use this command!');
				}
			break;
            case 'removeCustomMsg':
				if((messages.member != null && messages.member.hasPermission("ADMINISTRATOR")) || userCmd){
					if(args.length == 2 && !isNaN(args[1])){
						var index = parseInt(args[1]);
						if(index < customMsgs.length){
							customMsgs.splice(index - 1, 1);
							messages.reply('Message index #' + index + ' successfully removed!');
						} else {
							messages.reply('Message index invalid. Please use !customMsgList command to see valid message indexes!');
						}
					} else {
						if(args.length == 1){
							if(customMsgs.length != 0){
								customMsgs.splice(customMsgs.length - 1, 1);
								messages.reply('Most recently added message successfully removed!');
							} else {
								messages.reply('No messages to remove!');
							}
						} else {
							messages.reply('Invalid command syntax. Should be \"!removeCustomMsg\" or \"!removeCustomMsg <message_index>\"!');
						}
					}
				} else {
					messages.reply('You must be a server admin to use this command!');
				}
			break;
			case 'help':
				messages.reply('Commands:\n!setCustomMsgs <true/false> -- Turn custom response messages OFF/ON\n!customMsgList -- See full list of insults\n!addCustomMsg <"Your Message"> -- Add custom response message\n!removeCustomMsg -- Remove most recently added insult from list\n!removeCustomMsg <message_index> -- Remove an insult from the list\n!allowUserCmd <true/false> -- Allow all users to use commands\n');
			break;
         }
     }
});

