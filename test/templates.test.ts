import { describe, expect, test } from 'vitest';
import { createHelpers } from 'yeoman-test';
import { spawn, exec } from 'child_process';
import * as dotenv from 'dotenv';
import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));
const TIMEOUT = 30_000; // 30 seconds

dotenv.config();

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) {
	throw new Error('You must specify a valid bot token in the BOT_TOKEN environment variable');
}

const defaultAnswers = {
	botName: 'test-run-bot',
	botType: 'typescript',
	botToken: BOT_TOKEN,
	openWithCode: false,
};

describe('Check if the templates work', () => {
	const targetRoot = path.join(__dirname, 'test-temp');
	const moduleRoot = path.join(__dirname, 'app');
	const resultRoot = path.join(targetRoot, defaultAnswers.botName);

	test('Should generate and run TypeScript Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers(defaultAnswers)
			.then(async () => {
				const result = await runBot('node', ['./dist/src/index.js'], resultRoot);
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 120_000);

	
	test('Should generate and run Python Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({...defaultAnswers, botType: 'python' })
			.then(async () => {
				// install dependencies 
				await exec('pip3 install -r requirements.txt', { cwd: resultRoot });

				const result = await runBot('python', ['main.py'], resultRoot);
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 120_000);
});


async function runBot(command: string, args: string[], root: string): Promise<string> {
	const childProcess = spawn(command, args, { cwd: root, stdio: 'pipe', timeout: TIMEOUT });

	const result = await new Promise<string>((resolve) => {
		// timeout
		const timeout = setTimeout(() => {
			resolve('TIMEOUT');
		}, TIMEOUT);

		// output
		childProcess.stdout.on('data', (data) => {
			clearTimeout(timeout);
			
			resolve(data.toString());
		});

		childProcess.stderr.on('data', (data) => {
			clearTimeout(timeout);

			resolve(data.toString());
		});

		childProcess.on('close', () => {
			clearTimeout(timeout);
		});

	});

	childProcess.kill('SIGINT');
	return result;
}


const BOT_OUTPUT_START = 'Bot is logged in as';