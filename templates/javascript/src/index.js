const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance with Intents that specify which privileged intents your bot requires
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


// Run this code when the client is ready. This event will only trigger one time after logging in
client.once('ready', () => {
  console.log(`Bot is logged in as ${client.user.tag}.`);
});

// Listen for messages
client.on('messageCreate', async message => {
  const { content } = message;
  // Reply with "Pong!" when someone says "!ping"
  if (content === "!ping") {
    return await message.reply("Pong!");
  }
});


// Login to Discord with your app's token
client.login(token);

// For more information about the Discord.js library, visit https://discord.js.org/#/docs/main/stable/general/welcome