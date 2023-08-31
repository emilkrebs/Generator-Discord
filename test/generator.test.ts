import { describe, test } from 'vitest';
import path from 'path';
import { createHelpers } from 'yeoman-test';
import {EOL} from 'os'

const typescriptAnswers = {
    botName: 'typescript-bot',
    botType: 'typescript',
    botToken: 'xxx',
    openWithCode: false,
}

const pythonAnswers = {
    botName: 'python-bot',
    botType: 'python',
    botToken: 'xxxx',
    openWithCode: false,
}

describe('Check if the generator works', () => {
    test.skip('Should generate typescript files', async () => {
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
    test.skip('Should generate python files', async () => {
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
    test('Should generate rust files', async () => {
        const context = createHelpers({}).run(path.join(__dirname, '../app'));
        context.targetDirectory = path.join(__dirname, '../test-temp'); // generate in test-temp
        context.cleanTestDirectory(true); // clean-up test-temp
        await context.onGenerator(generator => generator.destinationRoot(context.targetDirectory, false))
            .withAnswers({
                ...pythonAnswers,
                botType: 'rust',
            })
            .then((result) => {
                result.assertFile([`${pythonAnswers.botName}/Cargo.toml`]);
                result.assertFile([`${pythonAnswers.botName}/src/main.rs`]);
            });
        context.cleanup(); // clean-up
    }
    , 120_000);
});


function normilizeEOL(str: string) {
    return str.replace(/\r?\n/g, EOL);
}

// norminlize end of line
const CONFIG_JSON_EXPECTED = normilizeEOL(`{
    "token":"xxx"
}`);

const BOT_PY_EXPECTED = normilizeEOL(`import discord

intents = discord.Intents.default()
intents.message_content = True

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

client.run('xxxx')`);