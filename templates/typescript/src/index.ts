import { Client, Intents } from 'discord.js';
import colors from 'colors';
import { token } from '../config.json';


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log(getTime() + colors.green('Bot is Ready.'));
    console.log(getTime() + colors.green(`Bot is logged in as ${colors.yellow(client.user!.tag)}.`));
});

function getTime() {
    let dateTime = new Date()
    return colors.gray(`[${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}] `);
}
// Login to Discord with your client's token
client.login(token);