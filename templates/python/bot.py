import discord
from discord.ext import commands

# Define bot prefix and create bot instance
bot_prefix = "!"
bot = commands.Bot(command_prefix=bot_prefix)

# Define bot events
@bot.event
async def on_ready():
    print(f"Logged in as {bot.user.name} ({bot.user.id})")

# Define bot commands
@bot.command()
async def ping(ctx):
    await ctx.send("Pong!")

# Run bot with bot token
bot.run("<%= bot-token %>")

# For more information on how to use discord.py, visit https://discordpy.readthedocs.io/en/latest/