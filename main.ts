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

const smtpParams = {
  host: 'core.bc8.org',
  port: 587
};

const sendTo = 'lennon+jobinfo@bc8.org';
const defaultEditorMessage = '\n\n# Enter your message above. '
  + 'Type Ctrl-D to save and finish, or Ctrl-C to cancel.\n'
  + '# These lines will be removed automatically.';

const mail = mailer.createTransport(smtpParams);

const loadPage = (page: string) => 
  fs.readFileSync(path.join(__dirname, 'pages', `${page}.md`)).toString();

const renderPage = (page: string) =>
  term.wrap(marked(loadPage(page), { renderer: new termRenderer() }));

const defaultPrompt = chalk.blueBright('resume>');

const emailPat = /^\w+[^@]+@[\w\.]+\w+$/;

cli.log(`resume v${pkg.version} initialized`);

cli.command('about', 'Background Information on @rcoder')
  .action(async (args) => { renderPage('about') });

cli.command('skills', 'Technical Skills')
  .action(async (args) => { renderPage('skills') });

cli.command('contact', 'Send email to @rcoder')
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
      }
    ]);

    const buffer = editor(defaultEditorMessage);

    buffer.on('submit', async (rawBody: string) => {
      const body = rawBody.replace(defaultEditorMessage, '').slice(0, 500);

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