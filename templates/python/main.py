import discord

intents = discord.Intents.default()

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'Bot is logged in as  {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('!ping'):
        await message.channel.send('Pong!')

# 'log_handler=None' is used to disable the default logging handler. Remove it if you want to use the default logging handler.
client.run('<%= bot-token %>', log_handler=None)
