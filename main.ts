import vorpal from 'vorpal';
import marked from 'marked';
import chalk from 'chalk';
import inquirer from 'inquirer';
import terminal from 'terminal-kit';
import termRenderer from 'marked-terminal';
import mailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'));

const cli = new vorpal();
const term = terminal.terminal;

const editor = require('tiny-cli-editor');

import pkg from './package.json';
import { doesNotReject } from 'assert';

const smtpParams = {
  host: 'core.bc8.org',
  port: 587
};

type Page = {
  title: string;
  name: string;
  content: string;
}

const pagesDir = path.join(__dirname, 'pages');

const allPages: Page[] = fs.readdirSync(pagesDir).map(file => {
  const content = fs.readFileSync(path.join(pagesDir, file)).toString();
  const name = path.basename(file, '.md');
  const titleMatch = content.match(/^# (.*)$/m);
  const title = titleMatch ? titleMatch[1] : name;
  return { title: title, name: name, content: content };
});

const sendTo = 'lennon+jobinfo@bc8.org';
const defaultEditorMessage = '\n\n# Enter your message above. '
  + 'Type Ctrl-D to save and finish, or Ctrl-C to cancel.\n'
  + '# These lines will be removed automatically.';

const mail = mailer.createTransport(smtpParams);

const loadPage = (name: string) => {
  const page = allPages.find(page => page.name === name);
  if (page) {
    return page.content;
  } else {
    throw new Error(`couldn't find page ${name}`);
  }
}

const screenBufOptions = {
  attr: {
    defaultColor: true
  },
  transparencyChar: '',
  transparencyType: 0
};

const renderPage = (page: string) =>
  term.wrap(marked(loadPage(page), { renderer: new termRenderer() }));

const defaultPrompt = chalk.blueBright('cv>');

const emailPat = /^\w+[^@]+@[\w\.]+\w+$/;

cli.log(`resume v${pkg.version} initialized`);

allPages.forEach(page => 
  cli.command(page.name, chalk.greenBright(page.title))
    .action(async () => { renderPage(page.name) })
);

cli.command('contact', chalk.yellow('Send email to Lennon'))
  .action(async (args) => {
    cli.hide();

    const choices = await inquirer.prompt([
      {
        type: 'input',
        name: 'from',
        message: 'From:',
        validate: input => input.match(emailPat) ? true : 'please enter an email address'
      },
      {
        type: 'suggest',
        name: 'subject',
        message: 'Subject:',
        suggestions: [
          'Question',
          'Job Opening',
          'Introduction',
          'Top Urgent!'
        ].sort((a, b) => Math.random()-0.5),
        validate: input => input.match(/\w+/) ? true : 'please enter a subject'
      },
      {
        type: 'suggest',
        name: 'contact',
        message: 'Preferred contact method:',
        suggestions: [
          'Email',
          'Phone (# provided in message)',
          'Other (described in message)'
        ],
        validate: input => input.match(/\w+/) ? true : 'please enter a contact method'
      }
    ]);

    const buffer = editor(defaultEditorMessage);

    buffer.on('submit', async (rawBody: string) => {
      const body = `Automated message! Sent from clicv v${pkg.version}\n\n---\n`
        + rawBody.replace(defaultEditorMessage, '').slice(0, 500)
        + `\n---\nFollow-up via: \n${choices.contact}`;

      cli.log(chalk`{green From:}    ${choices.from}`);
      cli.log(chalk`{green Subject:} ${choices.subject}`);
      cli.log(chalk`{green Message:}\n`);
      cli.log(body);
      cli.log('\n');

      const { doit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'doit',
          message: 'Send?',
          default: true
        }
      ]);

      if (doit) {
        await mail.sendMail({
          to: sendTo,
          from: choices.from,
          subject: choices.subject,
          text: body
        });
        cli.log('Email sent!');
      }

      cli.show();
    });

    buffer.on('abort', async () => {
      cli.show();
    });
  });

cli.exec('help');
cli.delimiter(defaultPrompt).show();