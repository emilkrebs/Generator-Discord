import Generator from 'yeoman-generator';

interface Answers {
    botName: string;
    openWithCode: boolean;
}



class DiscordGenerator extends Generator {
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
                validate: (input: string): boolean | string =>
                    /^[a-zA-Z].*$/.test(input)
                        ? true
                        : 'The language name must start with a letter.',
            },
            this.option('open', { type: Boolean, alias: 'o', description: 'Open the generated extension in Visual Studio Code' })
    
        ]);
        this.log(this.answers)
    }

}


export = DiscordGenerator;