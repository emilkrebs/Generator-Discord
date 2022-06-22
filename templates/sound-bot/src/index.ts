import { Client, Intents } from 'discord.js';
import colors from 'colors';
import { token, songUrl, playCommand } from '../config.json';

import { createAudioPlayer, joinVoiceChannel, createAudioResource, StreamType, AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('messageCreate', async message => {
    if (!message.guildId) return;
    const { content } = message;
    if (content === playCommand) {
        const channel = message.member!.voice.channel;
        if (channel != null) {
            let player = createAudioPlayer();
            const connection = joinVoiceChannel({
                channelId: channel!.id,
                guildId: channel!.guild.id,
                adapterCreator: message.guild!.voiceAdapterCreator,
            });
            connection.subscribe(player);
            playSound(player);
            player.on(AudioPlayerStatus.Idle, () =>{
                playSound(player);
            });
        }
        else {
            await message.reply({ content: "You are not in a voice channel." });
            return;   
        }
    }
});

function playSound(player: AudioPlayer){
	let resource = createAudioResource(songUrl, {
		inputType: StreamType.Arbitrary
	});
	player.play(resource);
}

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
