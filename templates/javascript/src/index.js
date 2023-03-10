const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance with Intents that specify which privileged intents your bot requires
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!';

// Run this code when the client is ready. This event will only trigger one time after logging in
client.once('ready', () => {
  console.log(`Bot is logged in as ${client.user.tag}.`);
});


// Listen for messages
client.on('messageCreate', async message => {
  // Ignore messages that don't start with the prefix or are from a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Split the message into command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  // ping - bot will reply with Pong!
  if (command === 'ping') {
    await message.reply('Pong!');
  }
  // say <message> - bot will send the message
  else if (command === 'say') {
    if (!args.length) {
      await message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      return;
    }
    await message.channel.send(args.join(' '));
    return;
  }
});


// Login to Discord with your app's token
client.login(token);

// For more information about the Discord.js library, visit https://discord.js.org/#/docs/main/stable/general/welcome∏