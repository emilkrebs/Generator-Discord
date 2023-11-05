import { describe, test } from 'vitest';
import { createHelpers } from 'yeoman-test';
import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));


const defaultAnswers = {
	botName: 'test-bot',
	botType: 'typescript',
	botToken: 'xxx',
	openWithCode: false,
};

describe('Check yeoman generator works', () => {
	const targetRoot = path.join(__dirname, 'test-temp');
	const moduleRoot = path.join(__dirname, 'app');
	const resultRoot = path.join(targetRoot, defaultAnswers.botName);

	test('Should produce TypeScript files', async () => {
		const context = createHelpers({}).run(moduleRoot);
		const configJson = path.join(resultRoot, 'config.json');

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers(defaultAnswers)
			.withArguments(['skip-install', 'skip-build'])
			.then((result) => {
				const files = [
					configJson,
					resultRoot + '/src/index.ts',
					resultRoot + '/tsconfig.json',
					resultRoot + '/package.json',
				];
				result.assertFile(files);
				result.assertJsonFileContent(configJson, CONFIG_JSON_EXPECTED);
			});
		// context.cleanup();
	}, 120_000);

	test('Should produce Python files', async () => {
		const context = createHelpers({}).run(moduleRoot);
		const mainPy = path.join(resultRoot, 'main.py');

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({ ...defaultAnswers, botType: 'python' })
			.then((result) => {
				const files = [
					mainPy,
					resultRoot + '/requirements.txt',
				];
				result.assertFile(files);
				// result.assertFileContent(mainPy, PYTHON_BOT_EXPECTED);
			});
		context.cleanup();
	}, 120_000);

	test('Should produce Rust files', async () => {
		const context = createHelpers({}).run(moduleRoot);
		const cargoToml = path.join(resultRoot, 'Cargo.toml');

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({ ...defaultAnswers, botType: 'rust' })
			.then((result) => {
				const files = [
					resultRoot + '/src/main.rs',
					cargoToml
				];
				result.assertFile(files);
				result.assertFileContent(cargoToml, CARGO_TOML_EXPECTED);
			});
		context.cleanup();
	}, 120_000);
});

const CONFIG_JSON_EXPECTED: Record<string, string> = {
	'token': 'xxx'
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

client.run('${defaultAnswers.botToken}')
`;

const CARGO_TOML_EXPECTED = `[package]
name = "${defaultAnswers.botName}" 
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
serenity = { version = "0.11.6", default-features = false, features = ["client", "gateway", "rustls_backend", "model"] }
tokio = { version = "1.0", features = ["macros", "rt-multi-thread"] }
`;