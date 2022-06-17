const { Client, Intents } = require('discord.js');
const colors = require('colors');
const { token } = require('../config.json');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// run this code once when your client is ready
client.once('ready', () => {
  console.log(getTime() + colors.green('Bot is Ready.'));
  console.log(getTime() + colors.green(`Bot is logged in as ${colors.yellow(client.user.tag)}.`));
});

// run this code when a new message is created
client.on('messageCreate', async message => {
  const { content } = message;
  if (content === "!ping") {
    return await message.reply("pong!");
  }
});


// get the current time to get useful log messages
function getTime() {
  let dateTime = new Date()
  return colors.gray(`[${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}] `);
}

// login with your client's token
client.login(token);

// for more information check out the official guide: https://discordjs.guide/creating-your-bot