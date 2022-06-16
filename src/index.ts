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
    programmingLanguage: string;
    botToken: string;
    openWithCode: boolean;
}

export default class DiscordGenerator extends Generator {
    private answers: Answers;

    constructor(args: string | string[], options: Generator.GeneratorOptions) {
        super(args, options);
    }

    async prompting(): Promise<void> {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'botName',
                message: 'Your Discord Bot name:',
                default: 'My Bot',
            },
            {
                type: 'list',
                name: 'programmingLanguage',
                message: 'The programming language you want to use.',
                choices: [
                    {
                        name: 'TypeScript',
                        value: 'typescript'
                    },
                    {
                        name: 'JavaScript',
                        value: 'javascript'
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
    writing(): void {
        this.sourceRoot(path.join(__dirname, TEMPLATE_DIR + this.answers.programmingLanguage));
        ['.'].forEach(
            (path: string) => {
                const replaceTemplateWords = (
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
                            replaceTemplateWords(this.answers, content)
                    }
                );
            }
        );
    }
    async install(): Promise<void> {
        const answer = await this.prompt({
            type: 'list',
            name: 'openWithCode',
            message: 'Do you want to open the new folder with Visual Studio Code?',
            choices: [
                {
                    name: 'code',
                    value: true
                },
                {
                    name: 'skip',
                    value: false
                }
            ]
        });
        this.log('Your Discord Bot ' + this.answers.botName + ' has been created!');
        this.log('');
        if (answer && answer.openWithCode) {
            this.spawnCommand('code', [this.destinationPath()]);
        }
    }
}