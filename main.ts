import Vorpal from 'vorpal';
import Marked from 'marked';
import Chalk from 'chalk';
import Inquirer from 'inquirer';
import Terminal from 'terminal-kit';
import TerminalRenderer from 'marked-terminal';
import NodeMailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

const v = new Vorpal();
const t = Terminal.terminal;

const smtpParams = {
  host: 'core.bc8.org',
  port: 587
};

const sendTo = 'lennon+jobinfo@bc8.org';

const m = NodeMailer.createTransport(smtpParams);

const loadPage = (page: string) => 
  fs.readFileSync(path.join(__dirname, 'pages', `${page}.md`)).toString();

const renderPage = (page: string) =>
  t.wrap(Marked(loadPage(page), { renderer: new TerminalRenderer() }))

const defaultPrompt = Chalk.blueBright('rcoder>');

const emailPat = /^\w+[^@]+@[\w\.]+\w+$/;

v.command('about', 'Background Information on @rcoder')
  .action(async (args) => { renderPage('about') });

v.command('skills', 'Technical Skills')
  .action(async (args) => { renderPage('skills') });

v.command('contact', 'Send email to @rcoder')
  .action(async (args) => {
    const choices = await Inquirer.prompt([
      {
        type: 'input',
        name: 'from',
        message: 'From:',
        validate: input => input.match(emailPat) ? true : 'please enter an email address'
      },
      {
        type: 'subject',
        name: 'subject',
        message: 'Subject:',
        default: 'reaching out',
        validate: input => input.match(/\w+/) ? true : 'please enter a subject'
      },
      {
        type: 'editor',
        name: 'body',
        validate: input => input.length > 0
      },
      {
        type: 'confirm',
        name: 'doit',
        message: 'Send?',
        default: true
      }
    ])
    if (choices.doit) {
      await m.sendMail({
        to: sendTo,
        from: choices.from,
        subject: choices.subject,
        text: choices.body
      });
      v.log('Email sent!');
    }
  });

v.exec('help');
v.delimiter(defaultPrompt).show();