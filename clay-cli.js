#! /usr/bin/env node
var   program           = require('commander')
 ,    path              = require('path')
 ,    os                = require('os')
 ,    chalk             = require('chalk')
 ,    fs                = require('fs')
 ,    print             = console.log
 ,    Service           = require('./src/service.js')
 ,    Account           = require('./src/account.js')
 ,    getCredentials    = require('./src/get-credentials.js')
 ,    getClayConfig     = require('./src/get-clay-config.js');

// Check node version and give an error message if it's too low

try {
  var nodeVersion = parseFloat(process.version.split('v')[1]); // remove the v in the string and parse the float
  if (nodeVersion < 4) {
    print(NODE_OLD_ERR);
    process.exit();
  }
}
catch (e) {
  // TODO: Don't fail if process.version formatting changes in the future instead add some production logging
}

const NODE_OLD_ERR       = chalk.white("Your node version is out of date. Please install node version 4 or greater. For help on how to do that go to: https://github.com/clay-run/clay-cli#faq")
 ,    NO_CREDENTIALS_ERR = chalk.white("You must sign up or login to use Clay. Type ")+chalk.red("clay signup")+chalk.white(" or ")+chalk.red("clay login")+chalk.white(" respectively.")
 ,    NOT_CLAY_DIR_ERR   = chalk.white("This command can only be run from within a clay service directory. Create a new service or go to an existing service folder and run the command again");

var clayCredentialsDir = path.resolve(os.homedir(), '.clay');
if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)

// get credentials if not login or signup command
var authCommands = ['login', 'signup'];
var globalCommands = authCommands.concat(['new', 'list', '--version']);


if(!authCommands.find((command) => command == process.argv[2])) {
  var clayCredentials = getCredentials(clayCredentialsDir);
  if(!clayCredentials) {
    print(NO_CREDENTIALS_ERR)
    process.exit();
  }
}

if(process.argv[2] && !globalCommands.find((command) => command == process.argv[2]) && getClayConfig() == null) {
    print(NOT_CLAY_DIR_ERR);
    process.exit();
}

const clayApi = (process.env.CLAY_DEV) ? 'http://localhost:4500' : 'https://clay.run'
 ,    apis    = {
  signupApi:`${clayApi}/api/v1/auth/signup`,
  loginApi: `${clayApi}/api/v1/auth/login`,
  methodsApi: `${clayApi}/api/v1/services/public/methods`,
  logsApi: `${clayApi}/api/v1/services/logs`,
  servicePage: `${clayApi}/services`
}

var service = new Service({
  credentials: clayCredentials,
  clayConfig: getClayConfig(),
  apis: apis
})

var account = new Account({
  credentials: clayCredentials,
  credentialsDir: clayCredentialsDir,
  apis: apis
})

program
.version('0.3.4')
.command('new [serviceName]')
.description('creates a new service with the name <serviceName>')
.action((projectName) => service.create(projectName));

program
.command('deploy')
.description('deploys service that is defined in the current directory')
.action(() => service.deploy({mode: 'PUT', dir: process.cwd()}));

program
.command('info')
.description('get a description of your service')
.action(() => service.info());

program
.command('logs')
.description('get production logs for your service')
.action(() => service.logs());

program
.command('list')
.description('list services in your account')
.action(() => account.list());

program
.command('test')
.description('test your service by running it locally')
.action(() => service.test());

program
.command('run')
.description('run your service in production')
.action(() => service.run());

program
.command('signup')
.description('signup to clay')
.action(() => account.signup());

program
.command('login')
.description('login to clay')
.action(() => account.login());

program.parse(process.argv);


if (!process.argv.slice(2).length) {
  const CURR_USER_MSG = chalk.white(`You are currently signed in as: `)+chalk.red(`${clayCredentials.username}`);
  print(CURR_USER_MSG)
  program.outputHelp();
  if(getClayConfig()) service.info();
}

