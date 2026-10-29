import { describe, expect, test } from 'vitest';
import helpers from 'yeoman-test';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const __dirname = url.fileURLToPath(new URL('../', import.meta.url));
const moduleRoot = path.join(__dirname, 'app');

const defaultAnswers = {
	botName: 'test-run-bot',
	botToken: 'test-token',
	openWithCode: false,
};

type BotType = 'typescript' | 'javascript' | 'python' | 'rust';

/** Generate a bot and return the directory it was written to. */
async function generate(botType: BotType, args: string[] = []): Promise<string> {
	const result = await helpers.run(moduleRoot)
		.withAnswers({ ...defaultAnswers, botType })
		.withArguments(args)
		.run();

	return path.join(result.cwd, defaultAnswers.botName);
}

/** Run a command and return its combined output, whether it succeeds or not. */
async function run(command: string, args: string[], root: string, timeout: number): Promise<string> {
	try {
		const { stdout, stderr } = await exec(command, args, { cwd: root, timeout });
		return `${stdout}${stderr}`;
	} catch (error) {
		const failure = error as { stdout?: string; stderr?: string; message?: string };
		return `${failure.stdout ?? ''}${failure.stderr ?? ''}${failure.message ?? ''}`;
	}
}

describe('Generated templates', () => {
	test('substitutes the bot name and token and ships a .gitignore', async () => {
		for (const botType of ['typescript', 'javascript', 'python', 'rust'] as BotType[]) {
			const root = await generate(botType, ['skip-build', 'skip-install']);
			const gitignore = await readFile(path.join(root, '.gitignore'), 'utf8');

			expect(gitignore.length).toBeGreaterThan(0);
			expect(gitignore).not.toContain('_gitignore');
			expect(gitignore).toContain(botType === 'python' ? 'config.py' : botType === 'rust' ? 'target/' : 'config.json');

			const configFile = botType === 'python' ? 'config.py' : botType === 'rust' ? 'src/main.rs' : 'config.json';
			const config = await readFile(path.join(root, configFile), 'utf8');
			expect(config).toContain(defaultAnswers.botToken);
			expect(config).not.toContain('<%= bot-token %>');

			const nameFile = botType === 'rust' ? 'Cargo.toml' : 'package.json';
			if (existsSync(path.join(root, nameFile))) {
				expect(await readFile(path.join(root, nameFile), 'utf8')).toContain(defaultAnswers.botName);
			}

			if (botType === 'typescript' || botType === 'javascript') {
				expect(existsSync(path.join(root, 'node_modules'))).toBe(false);
			}
		}
	}, 120_000);

	test('generates, builds and starts a TypeScript bot', async () => {
		const root = await generate('typescript');
		expect(existsSync(path.join(root, 'dist/src/index.js'))).toBe(true);

		const output = await run('node', ['dist/src/index.js'], root, 60_000);
		expect(output).toContain('TokenInvalid');
	}, 240_000);

	test('generates, checks and starts a JavaScript bot', async () => {
		const root = await generate('javascript');
		await exec('node', ['--check', 'src/index.js'], { cwd: root });

		const output = await run('node', ['src/index.js'], root, 60_000);
		expect(output).toContain('TokenInvalid');
	}, 240_000);

	test('generates a Python bot that compiles', async () => {
		const root = await generate('python', ['skip-build', 'skip-install']);
		await exec('python3', ['-m', 'py_compile', 'main.py', 'config.py'], { cwd: root });
	}, 120_000);

	test('generates a Rust bot that compiles', async () => {
		const root = await generate('rust', ['skip-build', 'skip-install']);
		await exec('cargo', ['check'], { cwd: root, timeout: 300_000 });
	}, 360_000);
});