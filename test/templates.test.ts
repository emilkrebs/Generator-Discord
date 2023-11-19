import { describe, expect, test } from 'vitest';
import { createHelpers } from 'yeoman-test';
import { spawn, exec } from 'child_process';
import * as dotenv from 'dotenv';
import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));
const DEFAULT_TIMEOUT = 60_000; // 1 minute

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
				const result = await runBot('node', ['./dist/src/index.js'], resultRoot, DEFAULT_TIMEOUT);
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 120_000);

	test('Should generate and run JavaScript Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({ ...defaultAnswers, botType: 'javascript' })
			.then(async () => {
				const result = await runBot('node', ['./src/index.js'], resultRoot, DEFAULT_TIMEOUT);
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 120_000);


	test.skip('Should generate and run Python Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({ ...defaultAnswers, botType: 'python' })
			.then(async () => {
				// install dependencies 
				await exec('pip3 install -r requirements.txt', { cwd: resultRoot });

				const result = await runBot('python', ['main.py'], resultRoot, DEFAULT_TIMEOUT);
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 120_000);



	test('Should generate and run Rust Discord Bot', async () => {
		const context = createHelpers({}).run(moduleRoot);

		context.targetDirectory = targetRoot;
		context.cleanTestDirectory(true);
		await context
			.onGenerator(generator => {
				generator.destinationRoot(targetRoot);
			})
			.withAnswers({ ...defaultAnswers, botType: 'rust' })
			.withArguments(['skip-build'])
			.then(async () => {
				const result = await runBot('cargo', ['run', '--release', '--quiet'] , resultRoot, 120_000); // 2 minutes
				expect(result).toContain(BOT_OUTPUT_START);
			});

		context.cleanup();
	}, 180_000); // 3 minutes
});

/** Run a command in a child process and return the output
 * @param {string} command The command to run
 * @param {string[]} args The arguments to pass to the command
 * @param {string} root The root directory to run the command in
 * @param {number} timeoutTime The time in milliseconds to wait before timing out
 * @returns {Promise<string>} The output of the command
*/
async function runBot(command: string, args: string[], root: string, timeoutTime: number): Promise<string> {
	const childProcess = spawn(command, args, { cwd: root, stdio: 'pipe', timeout: timeoutTime });

	const result = await new Promise<string>((resolve) => {
		// timeout
		const safetyTimeout = setTimeout(() => {
			resolve('TIMEOUT');
		}, timeoutTime);

		// output
		childProcess.stdout.on('data', (data) => {
			clearTimeout(safetyTimeout);

			resolve(data.toString());
		});

		childProcess.stderr.on('data', (data) => {
			clearTimeout(safetyTimeout);

			resolve(data.toString());
		});

		childProcess.on('close', () => {
			clearTimeout(safetyTimeout);
		});

	});

	childProcess.kill('SIGINT');
	return result;
}


const BOT_OUTPUT_START = 'Bot is logged in as';
