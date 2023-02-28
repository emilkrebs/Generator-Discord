// write a unit test for the yeoman generator

import { describe, test } from 'vitest';
import path from 'path';
import { createHelpers } from 'yeoman-test';
import {EOL} from 'os'

const typescriptAnswers = {
    botName: 'typescript-bot',
    botType: 'typescript',
    botToken: 'xxx',
}

const pythonAnswers = {
    botName: 'python-bot',
    botType: 'python',
    botToken: 'xxxx',
}

describe('Check if the generator works', () => {
    test('Should generate typescript files', async () => {
        const context = createHelpers({}).run(path.join(__dirname, '../app'));
        context.targetDirectory = path.join(__dirname, '../test-temp'); // generate in test-temp
        context.cleanTestDirectory(true); // clean-up test-temp
        await context.onGenerator(generator => generator.destinationRoot(context.targetDirectory, false))
            .withAnswers(typescriptAnswers)
            .then((result) => {
                result.assertFile([`${typescriptAnswers.botName}/package.json`]);
                result.assertFile([`${typescriptAnswers.botName}/config.json`]);
                result.assertFile([`${typescriptAnswers.botName}/src/index.ts`]);
                result.assertFileContent(`${typescriptAnswers.botName}/config.json`, CONFIG_JSON_EXPECTED);
            });
        context.cleanup(); // clean-up
    }, 120_000);
    test('Should generate python files', async () => {
        const context = createHelpers({}).run(path.join(__dirname, '../app'));
        context.targetDirectory = path.join(__dirname, '../test-temp'); // generate in test-temp
        context.cleanTestDirectory(true); // clean-up test-temp
        await context.onGenerator(generator => generator.destinationRoot(context.targetDirectory, false))
            .withAnswers(pythonAnswers)
            .then((result) => {
                result.assertFile([`${pythonAnswers.botName}/bot.py`]);
                result.assertFileContent(`${pythonAnswers.botName}/bot.py`, BOT_PY_EXPECTED);
            });
        context.cleanup(); // clean-up
    }, 120_000);
});


function normilizeEOL(str: string) {
    return str.replace(/\r?\n/g, EOL);
}

// norminlize end of line
const CONFIG_JSON_EXPECTED = normilizeEOL(`{
    "token":"xxx"
}`);

const BOT_PY_EXPECTED = normilizeEOL(`import discord
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
bot.run("xxxx")

# For more information on how to use discord.py, visit https://discordpy.readthedocs.io/en/latest/`);