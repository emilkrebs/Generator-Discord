import Generator from 'yeoman-generator';
import path from 'path';


const TEMPLATE_DIR = '../templates/';
const USER_DIR = '.';

const OPEN = '<%= ';
const CLOSE = ' %>';

const BOT_NAME = 'bot-name';
const BOT_TOKEN = 'bot-token';

interface Answers {
    botName: string;
    botType: string;
    botToken: string;
    openWithCode: boolean;
}


export default class DiscordGenerator extends Generator {
    private answers: Answers;

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
                new RegExp("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$").test(input)
                    ? true
                    : 'Your Discord Bot name does not match the pattern of: ^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$',

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
                    }
                    ,
                    {
                        name: 'New Discord Bot (Python)',
                        value: 'python'
                    }
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
        this.log("  \x1b[36m_____  _                       _   \x1b[31m_     ");
        this.log(" \x1b[36m|  __ \\(_)                     | | \x1b[31m(_)    ");
        this.log(" \x1b[36m| |  | |_ ___  ___ ___  _ __ __| |  \x1b[33m_ ___ ");
        this.log(" \x1b[36m| |  | | / __|/ __/ _ \\| '__/ _` | \x1b[33m| / __|");
        this.log(" \x1b[36m| |__| | \\__ \\ (_| (_) | | | (_| |\x1b[37m_\x1b[32m| \\__ \\");
        this.log(" \x1b[36m|_____/|_|___/\\___\\___/|_|  \\__,_\x1b[37m(_) \x1b[32m|___/");
        this.log("                                   \x1b[34m_/ |    ");
        this.log("                                  \x1b[35m|__/     ");
        this.log("\x1b[0m");
    }

    writing(): void {
        this.sourceRoot(path.join(__dirname, TEMPLATE_DIR + this.answers.botType));
        ['.'].forEach(
            (path: string) => {
                const replaceWords = (
                    answers: Answers,
                    content: Buffer
                ): string =>
                    [
                        [BOT_NAME, this.answers.botName],
                        [BOT_TOKEN, this.answers.botToken]
                    ].reduce(
                        (acc: string, [templateWord, userAnswer]) =>
                            acc.replace(
                                new RegExp(
                                    `${OPEN}${templateWord}${CLOSE}`,
                                    'g'
                                ),
                                userAnswer
                            ),
                        content.toString()
                    );
                this.fs.copy(
                    this.templatePath(path),
                    this.destinationPath(
                        USER_DIR,
                        this.answers.botName,
                        path
                    ),
                    {
                        process: (content: Buffer) =>
                            replaceWords(this.answers, content)
                    }
                );
            }
        );
    }
    async install(): Promise<void> {
        this.log('');
        this.log('Your Discord Bot ' + this.answers.botName + ' has been created!');
        const answer = await this.prompt({
            type: 'list',
            name: 'openWithCode',
            message: 'Do you want to open your Discord Bot with Visual Studio Code?',
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
}
