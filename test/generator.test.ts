import { describe, test } from 'vitest';
import path from 'path';
import { createHelpers } from 'yeoman-test';

const currentUrl = new URL('../', import.meta.url).pathname;

const defaultAnswers = {
	botName: 'test-bot',
	botType: 'typescript',
	botToken: 'xxx',
	openWithCode: false,
};

describe('Check yeoman generator works', () => {
	const targetRoot = path.join(currentUrl, defaultAnswers.botName) + '/';
    
	test('Should produce TypeScript files', async () => {
		const context = createHelpers({}).run(path.join(currentUrl, './app'));
		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true); 
		await context
			.withAnswers(defaultAnswers)
			.withArguments(['skip-install', 'skip-build'])
			.then((result) => {
				const files = [
					targetRoot + 'config.json',
					targetRoot + 'src/index.ts',
					targetRoot + 'tsconfig.json',
					targetRoot + 'package.json',
				];
				result.assertFile(files);
				result.assertJsonFileContent(targetRoot + 'config.json', CONFIG_JSON_EXPECTED);
			});
		context.cleanup();
	}, 120_000);

	test('Should produce Python files', async () => {
		const context = createHelpers({}).run(path.join(currentUrl, './app'));
		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true); 
		await context
			.withAnswers({...defaultAnswers, botType: 'python'})
			.then((result) => {
				const files = [
					targetRoot + 'main.py',
					targetRoot + 'requirements.txt',
				];
				result.assertFile(files);
				result.assertFileContent(targetRoot + 'main.py', PYTHON_BOT_EXPECTED);
			});
		context.cleanup();
	}, 120_000);

	test('Should produce Rust files', async () => {
		const context = createHelpers({}).run(path.join(currentUrl, './app'));
		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true); 
		await context
			.withAnswers({...defaultAnswers, botType: 'rust'})
			.then((result) => {
				const files = [
					targetRoot + 'src/main.rs',
					targetRoot + 'Cargo.toml',
				];
				result.assertFile(files);
				result.assertFileContent(targetRoot + 'Cargo.toml', CARGO_TOML_EXPECTED);
			});
		context.cleanup();
	}, 120_000);
});

const CONFIG_JSON_EXPECTED: Record<string, string> = {
	'token':'xxx'
};

const PYTHON_BOT_EXPECTED = `import discord

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

client.run('xxx')
`;

const CARGO_TOML_EXPECTED = `[package]
name = "test-bot" 
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
serenity = { version = "0.11.6", default-features = false, features = ["client", "gateway", "rustls_backend", "model"] }
tokio = { version = "1.0", features = ["macros", "rt-multi-thread"] }
`;