import discord
from config import TOKEN


prefix = '!'

class DefaultClient(discord.Client):
    async def on_ready(self):
        print(f'Logged in as {self.user} (ID: {self.user.id})')
        print('------')

    async def on_message(self, message):
        # we do not want the bot to reply to itself
        if message.author.id == self.user.id:
            return

        if message.content.startswith(prefix):
            command = message.content[len(prefix):].split()[0]
            args = message.content[len(prefix) + len(command):].strip()
            
            if command == 'ping':
                await message.channel.send('Pong!')
            elif command == 'say':
                # Get the message after the command
                message_to_send = args
                if message_to_send:
                    await message.channel.send(message_to_send)
                else:
                    await message.channel.send('Please provide a message to send.')
            elif command == 'help':
                await message.channel.send('Available commands: !ping, !say <message>, !help')

intents = discord.Intents.default()
intents.message_content = True

client = DefaultClient(intents=intents)
client.run(TOKEN)
