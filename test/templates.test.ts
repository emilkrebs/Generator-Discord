import { describe, expect, test } from 'vitest';
import { createHelpers } from 'yeoman-test';
import { spawn } from 'child_process';
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

	test('Should generate and run Python Discord Bot', async () => {
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
				console.info('Installing Python dependencies...');
				const result = await new Promise<string>((resolve) => {
					spawn('pip3', ['install', '-r', 'requirements.txt'], { cwd: resultRoot, timeout: DEFAULT_TIMEOUT })
						.on('close', async () => {
							console.info('Done installing Python dependencies.');

							resolve(await runBot('python', ['main.py'], resultRoot, DEFAULT_TIMEOUT));

						})
						.on('error', (err) => {
							console.error('There was an error while installing the Python dependecies', err);
							resolve('PYTHON DEPENDENCY ERROR');
						})
						.stderr.on('data', (data) => {
							console.error('There was an error while installing the Python dependecies', data);
							resolve('PYTHON DEPENDENCY ERROR');
						});
				});

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
				const result = await runBot('cargo', ['run', '--release', '--quiet'], resultRoot, 120_000); // 2 minutes
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
	const childProcess = spawn(command, args, { cwd: root, timeout: timeoutTime });

	const result = await new Promise<string>((resolve) => {
		const output: string[] = [];
		let currentOutputTimeout: NodeJS.Timeout;

		// timeout
		const safetyTimeout = setTimeout(() => {
			resolve('BOT RUN TIMEOUT');
		}, timeoutTime);

		const restartOutputTimeout = () => {
			currentOutputTimeout = setTimeout(() => {
				childProcess.kill('SIGINT');
				resolve(output.join('\n'));
			}, 5_000);
		};

		const clearTimeouts = () => {
			clearTimeout(safetyTimeout);
			clearTimeout(currentOutputTimeout);
		};

		const onData = (data: string) => {
			clearTimeouts();

			console.log('Bot Data:', data.toString());
			// if the bot has successfully started, resolve the promise
			if (data.toString().includes(BOT_OUTPUT_START)) {
				resolve(data.toString());
			}

			// restart output timeout
			restartOutputTimeout();
			output.push(data.toString());
		};

		// output
		childProcess.stdout.on('data', (data) => {
			onData(data.toString());
		});

		// output error
		childProcess.stderr.on('data', (data) => {
			onData(data.toString());
		});
		// process close
		childProcess.on('close', () => {
			clearTimeouts();

			resolve(output.join('\n'));
		});

	});

	childProcess.kill('SIGINT');
	return result;
}


const BOT_OUTPUT_START = 'Bot is logged in as'; 