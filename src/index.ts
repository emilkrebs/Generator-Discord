import Generator from 'yeoman-generator';
import path from 'path';

const TEMPLATE_DIR = '../templates/';
const USER_DIR = '.';

const BOT_NAME = /<%= bot-name %>/g;
const BOT_TOKEN = /<%= bot-token %>/g;

// needed for rust
const BOT_NAME_RUST = /bot_name/g;

type BotType = 'typescript' | 'javascript' | 'python' | 'rust';

interface Answers {
	botName: string;
	botType: BotType;
	botToken: string;
	openWithCode: boolean;
}


export default class DiscordGenerator extends Generator {
	private answers: Answers = {} as Answers;

	constructor(args: string | string[], options: Generator.GeneratorOptions) {
		super(args, options);
	}

	async prompting(): Promise<void> {
		this.logo();
		this.answers = await this.prompt([
			{
				type: 'input',
				name: 'botName',
				message: 'Your Discord Bot name:',
				default: 'my-bot',
				validate: (input: string): boolean | string =>
					new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$').test(input)
						? true
						: 'Invalid bot name. Please use only lowercase letters, numbers, and hyphens. Must start with a letter.'
			},
			{
				type: 'list',
				name: 'botType',
				message: 'The type of Discord Bot you want to create.',
				choices: [
					{
						name: 'New Discord Bot (TypeScript)',
						value: 'typescript'
					},
					{
						name: 'New Discord Bot (JavaScript)',
						value: 'javascript'
					},
					{
						name: 'New Discord Bot (Python)',
						value: 'python'
					},
					{
						name: 'New Discord Bot (Rust)',
						value: 'rust'
					},
				]
			},
			{
				type: 'input',
				name: 'botToken',
				message: 'Your Discord Bot Token. (Enter to leave blank)',
				default: 'your-bot-token'
			}
		]);
	}

	logo(): void {
		this.log('  \x1b[36m_____  _                       _   \x1b[31m_');
		this.log(' \x1b[36m|  __ \\(_)                     | | \x1b[31m(_)');
		this.log(' \x1b[36m| |  | |_ ___  ___ ___  _ __ __| |  \x1b[33m_ ___');
		this.log(' \x1b[36m| |  | | / __|/ __/ _ \\| \'__/ _` | \x1b[33m| / __|');
		this.log(' \x1b[36m| |__| | \\__ \\ (_| (_) | | | (_| |\x1b[37m_\x1b[32m| \\__ \\');
		this.log(' \x1b[36m|_____/|_|___/\\___\\___/|_|  \\__,_\x1b[37m(_) \x1b[32m|___/');
		this.log('                                   \x1b[34m_/ |');
		this.log('                                  \x1b[35m|__/');
		this.log('\x1b[0m');
	}

	writing(): void {
		this.sourceRoot(path.join(__dirname, TEMPLATE_DIR + this.answers.botType));
		const paths = ['.'];

		// iterate over all files
		for (let i = 0, len = paths.length; i < len; i++) {
			const path = paths[i];
			this.fs.copy(
				this.templatePath(path),
				this.destinationPath(
					USER_DIR,
					this.answers.botName,
					path
				),
				{
					process: (content) => this._replaceWords(content, this.answers)
				}
			);
		}
	}

	async install(): Promise<void> {
		this.log('');
		if (this.answers.botType === 'typescript' || this.answers.botType === 'javascript') {
			const options = { cwd: this.destinationPath(USER_DIR, this.answers.botName) };

			this.log('Installing dependencies...');
			this.spawnCommandSync('npm', ['install'], options);

			if (this.answers.botType === 'typescript') {
				this.log('Building your Discord Bot...');
				this.spawnCommandSync('npm', ['run', 'build'], options);
			}
		}

		this.log('Your Discord Bot \'\x1b[32m' + this.answers.botName + '\x1b[0m\' has been created!');

	}

	async end(): Promise<void> {
		const answer = await this.prompt({
			type: 'list',
			name: 'openWithCode',
			message: 'Do you want to open your Discord Bot with \x1b[36mVisual Studio Code\x1b[0m?',
			choices: [
				{
					name: 'open with `code`',
					value: true
				},
				{
					name: 'skip',
					value: false
				}
			]
		});
		this.log('');
		if (answer && answer.openWithCode) {
			this.spawnCommand('code', [this.destinationPath(
				USER_DIR,
				this.answers.botName
			)]);
		}
	}

	_replaceWords(content: Buffer, answers: Answers): string {
		if (answers.botType === 'rust') {
			return content.toString()
				.replace(BOT_TOKEN, answers.botToken)
				.replace(BOT_NAME_RUST, answers.botName);
		}

		return content.toString()
			.replace(BOT_TOKEN, answers.botToken)
			.replace(BOT_NAME, answers.botName);
	}
}
