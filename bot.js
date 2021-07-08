#!/usr/bin/env node
var bot;
var Discord = require('discord.js');
var client = new Discord.Client();
var mineflayer = require('mineflayer');
var viewer = require('prismarine-viewer');
var connected = false;
client.on('message', function(msg) {
  console.log('Received: ' + msg.content);
  var tokens = msg.content.split(' ');
  if (tokens[0] == 'minebot') {
    if (tokens.length == 1) {
      msg.reply('My name is Minebot. I can let users play Minecraft using Discord! (note: only one user can play at a time.) Use "minebot help" for help.');
    }
    else if (tokens[1] == 'help') {
      msg.reply(`Available commands:
minebot: get a lowdown of what this bot is.
minebot help: display this help message.
minebot connect [username/email] [password] [address] [port]: connect to a Minecraft server at address [address] with account [username/email] and [password] on port [port]. If you don't know the port, use 25565.
minebot disconnect: disconnect from a minecraft server if connected to one.
minebot forward/back/left/right: move one block in a specific direction.
minebot chat [message]: send [message] in the game chat.`);
    }
    else if (tokens[1] == 'connect') {
      if (tokens.length < 6) {
        msg.reply('Incorrect syntax. Use "minebot help" for help.');
      }
      else {
        if (connected) {
          msg.reply('Already connected to a server! Disconnect first.');
        }
        else {
          msg.reply('Connecting to server...');
          bot = mineflayer.createBot({
            username: tokens[2],
            password: tokens[3],
            host: tokens[4],
            port: tokens[5]
          });
          bot.on('error', function(err) {
            msg.reply('Error connecting to server: ' + err);
            connected = false;
          });
          bot.on('kick', function(reason) {
            msg.reply('Kicked from server! Reason: ' + reason);
            connected = false;
          });
          bot.on('spawn', function() {
            connected = true;
            viewer.mineflayer(bot, {port: 8080});
            msg.reply('Connected to server! Try moving around! To see what the bot sees, go to https://e07b07822c01.ngrok.io in your browser.');
            bot.chat('I am a bot. Minebot. I thought I\'d let you know :D');
          });
        }
      }
    }
    else if (tokens[1] == 'disconnect') {
      if (connected) {
        bot.quit();
        bot.viewer.close();
        connected = false;
        msg.reply('OK, disconnected from server.');
      }
      else {
        msg.reply('Cannot disconnect from server: not connected to server!');
      }
    }
    else if (tokens[1] == 'forward') {
      if (connected) {
        bot.setControlState('forward', true);
        setTimeout(function() {
          bot.setControlState('forward', false);
        }, 231);
        msg.reply('Moved forward one block.');
      }
      else {
        msg.reply('Connect to a server first!');
      }
    }
    else if (tokens[1] == 'back') {
      if (connected) {
        bot.setControlState('back', true);
        setTimeout(function() {
          bot.setControlState('back', false);
        }, 231);
        msg.reply('Moved back one block.');
      }
      else {
        msg.reply('Connect to a server first!');
      }
    }
    else if (tokens[1] == 'left') {
      if (connected) {
        bot.setControlState('left', true);
        setTimeout(function() {
          bot.setControlState('left', false);
        }, 231);
        msg.reply('Moved left one block.');
      }
      else {
        msg.reply('Connect to a server first!');
      }
    }
    else if (tokens[1] == 'right') {
      if (connected) {
        bot.setControlState('right', true);
        setTimeout(function() {
          bot.setControlState('right', false);
        }, 231);
        msg.reply('Moved right one block.');
      }
      else {
        msg.reply('Connect to a server first!');
      }
    }
    else if (tokens[1] == 'chat') {
      if (tokens.length < 3) {
        msg.reply('Incorrect syntax. Use "minebot help" for help.');
      }
      else {
        if (connected) {
          tokens.splice(0, 2);
          bot.chat(tokens.join(' '));
        }
        else {
          msg.reply('Connect to a server first!');
        }
      }
    }
    else {
      msg.reply('Sorry, I don\'t understand that command. Check the spelling or use "minebot help" for a list of commands and try again.');
    }
  }
});
client.login('ODYyMzM1NzI2MzQyNzY2NTky.YOW2ug.iYFkUYnVazggXYn1ovXzv8So1eA');
client.on('ready', function() {
  console.log('Logged in sucessfully, ready to accept messages on ' + client.user.tag);
  client.user.setActivity('Minecraft! You can too, by controlling Me! Use "minebot help" for help.');
});
process.on('SIGINT', function() {
  console.log('\nCaught Interrupt, logging out and quitting.');
  client.destroy();
  try {
    bot.quit();
  } catch (e) {}
  try {
    bot.viewer.close();
  } catch (e) {}
});
