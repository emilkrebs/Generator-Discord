import { describe, expect, test } from 'vitest';
import { createHelpers } from 'yeoman-test';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

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

	test('Should run TypeScript Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers(defaultAnswers)

			.then(async () => {
				const result = await runBot(resultRoot);
				expect(result).toBe(true);

			});
		context.cleanup();
	}, 120_000);
});


async function runBot(root: string): Promise<boolean> {
	const result = await new Promise<boolean>((resolve) => {

		const process = exec('npm run start', { cwd: root, timeout: 10000  }, (error, stdout, stderr) => {
			if (error) {
				console.error('Error',error);
				resolve(false);
			}

			if(stderr) {
				console.error('STDERR', stderr);
				resolve(false);
			}

			console.log(stdout);

			// if the bot is logged in return true and kill the process
			if (stdout.includes(BOT_OUTPUT_START)) {
				console.log('Bot is logged in, killing process');
				process.kill('SIGINT');
				resolve(true);
			}
		});

	});

	return result;
}



const BOT_OUTPUT_START = 'Bot is logged in as';