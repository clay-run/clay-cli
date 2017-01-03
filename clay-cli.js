#! /usr/bin/env node
var   program           = require('commander')
 ,    path              = require('path')
 ,    os                = require('os')
 ,    chalk             = require('chalk')
 ,    fs                = require('fs')
 ,    authCredentials   = require('./authorize-credentials.js')
 ,    createCredentials = require('./create-credentials.js')
 ,    getCredentials    = require('./get-credentials.js')
 ,    getClayConfig     = require('./get-clay-config.js')
 ,    showClayConfig    = require('./show-clay-config.js')
 ,    ServiceFactory    = require('./new-service.js')
 ,    runFactory        = require('./run-service.js')
 ,    LogsFactory       = require('./get-logs-service.js')
 ,    ListFactory       = require('./list-service.js')
 ,    DeployFactory     = require('./deploy-service.js');

var clayApi = (process.env.CLAY_DEV) ? 'http://localhost:4500' : 'https://tryclay.com';

const signupApi = `${clayApi}/api/v1/auth/signup`;
const authorizeApi = `${clayApi}/api/v1/auth/login`;
const methodsApi = `${clayApi}/api/v1/services/public/methods`;
const logsApi = `${clayApi}/api/v1/services/logs`;
const servicePage = `${clayApi}/services`;

var clayCredentialsDir = path.resolve(os.homedir(), '.clay');
if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)


// get credentials if not login or signup command
if(!(process.argv[2] == 'login' || process.argv[2] == 'signup')) {
  var clayCredentials = getCredentials(clayCredentialsDir);
  if(!clayCredentials) {
    console.log(chalk.white("You must sign up or login to use Clay. Type ")+chalk.red("clay signup")+chalk.white(" or ")+chalk.red("clay login")+chalk.white(" respectively."))
    process.exit();
  }
}

var deployService = new DeployFactory({
  credentials: clayCredentials,
  dir: process.cwd(),
  mode: 'PUT',
  clayConfig: null,
  api: methodsApi
});

var newService = new ServiceFactory({
  credentials: clayCredentials,
  api: methodsApi,
  servicePage: servicePage
});

var logsService = new LogsFactory({
  credentials: clayCredentials,
  api: logsApi,
  clayConfig: getClayConfig()
});

var listService = new ListFactory({
  credentials: clayCredentials,
  api: methodsApi
});

var runService = new runFactory({
  clayConfig: getClayConfig()
});

program
.version('0.1.0')
.command('new <serviceName>')
.description('creates a new service with the name <serviceName>')
.action((projectName) => newService.create(projectName));

program
.command('deploy')
.description('deploys service that is defined in the current directory')
.action(() => deployService.deploy());

program
.command('info')
.description('get a description of your service')
.action(() => showClayConfig());

program
.command('logs')
.description('get logs for your service')
.action(() => logsService.log());

program
.command('list')
.description('list services in your account')
.action(() => listService.list());

program
.command('run')
.description('runs service locally')
.action(() => runService.run());

program
.command('signup')
.description('signup to clay')
.action(() => createCredentials(signupApi, clayCredentialsDir));

program
.command('login')
.description('login to clay')
.action(() => authCredentials(authorizeApi, clayCredentialsDir));


program.parse(process.argv);


if (!process.argv.slice(2).length) {
  program.outputHelp();
  if(getClayConfig()) showClayConfig();
}








