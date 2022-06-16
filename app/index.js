"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const path_1 = __importDefault(require("path"));
const TEMPLATE_DIR = '../templates/';
const USER_DIR = '.';
const OPEN = '<%= ';
const CLOSE = ' %>';
const BOT_NAME = 'bot-name';
const BOT_TOKEN = 'bot-token';
class DiscordGenerator extends yeoman_generator_1.default {
    constructor(args, options) {
        super(args, options);
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.answers = yield this.prompt([
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
        });
    }
    writing() {
        this.sourceRoot(path_1.default.join(__dirname, TEMPLATE_DIR + this.answers.programmingLanguage));
        ['.'].forEach((path) => {
            const replaceTemplateWords = (answers, content) => [
                [BOT_NAME, this.answers.botName],
                [BOT_TOKEN, this.answers.botToken]
            ].reduce((acc, [templateWord, userAnswer]) => acc.replace(new RegExp(`${OPEN}${templateWord}${CLOSE}`, 'g'), userAnswer), content.toString());
            this.fs.copy(this.templatePath(path), this.destinationPath(USER_DIR, this.answers.botName, path), {
                process: (content) => replaceTemplateWords(this.answers, content)
            });
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield this.prompt({
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
        });
    }
}
exports.default = DiscordGenerator;
//# sourceMappingURL=index.js.map