#! /usr/bin/env node
var   program           = require('commander')
 ,    path              = require('path')
 ,    os                = require('os')
 ,    chalk             = require('chalk')
 ,    fs                = require('fs-extra')
 ,    print             = console.log
 ,    Service           = require('./src/service.js')
 ,    Account           = require('./src/account.js')
 ,    getCredentials    = require('./src/get-credentials.js')
 ,    getClayConfig     = require('./src/get-clay-config.js');


const NO_CREDENTIALS_ERR = chalk.white("You must sign up or login to use Clay. Type ")+chalk.red("clay signup")+chalk.white(" or ")+chalk.red("clay login")+chalk.white(" respectively.")
 ,    NOT_CLAY_DIR_ERR   = chalk.white("This command can only be run from within a clay service directory. Create a new service or go to an existing service folder and run the command again");

const clayApi = (process.env.CLAY_DEV) ? 'http://127.0.0.1:4500' : 'https://clay.run'
 , apis    = {
    signupApi:`${clayApi}/api/v1/auth/signup`,
    loginApi: `${clayApi}/api/v1/auth/login`,
    methodsApi: `${clayApi}/api/v1/services/public/methods`,
    logsApi: `${clayApi}/api/v1/services/logs`,
    downloadApi: `${clayApi}/services/kareemcore/download-lambda`,
    createApi: `${clayApi}/services/kareemcore/create-lambda`,
    forkApi: `${clayApi}/services/kareemcore/fork-lambda`,
    servicePage: `${clayApi}/services`
}

var clayCredentialsDir = path.resolve(os.homedir(), '.clay');
if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)

// get credentials if not login or signup command
var authCommands = ['login', 'signup', 'logout'];
var globalCommands = authCommands.concat(['new', 'list', ,'--help', '--version', 'open', 'run', 'download', 'fork', 'whoami', 'help']);

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
.description(chalk.white('Clay allows you to instantly build and remix cloud hosted functions'))
.version('0.4.9')
.usage('<command>')
.command('new [serviceName]')
.description('creates a new service with the name [serviceName].')
.action((cmd) => service.create(cmd, account))

program
.command('deploy')
.description('deploys service that is defined in the current directory')
.action(() => service.deploy({mode: 'PUT', dir: process.cwd()}));

program
.command('logs')
.description('Get production logs for your service')
.action(() => service.logs());

program
.command('test')
.description('test your service by running it locally')
.action(() => service.test());

program
.command('run [serviceName] [data]')
.description('run your service in production if run from within your service directory. Optionally you can run any Clay service. Pass the full name of the service which looks like this username/servicename')
.action((serviceName, data) => service.run(serviceName, data));

program
.command('open [serviceName]')
.description('open service config page in web browser')
.action((serviceName) => service.open(serviceName));

program
.command('info')
.description('get a description of your service')
.action(() => service.info());

program
.command('add:env [key] [value]')
.description('add an environment variable for api keys, secrets, and any static code that you should not be in your code')
.action((key, value) => service.addEnv(key, value));

program
.command('delete:env')
.description('delete an environment variable')
.action((key) => service.deleteEnv(key));

program
.command('list:env')
.description('list environment variables that are set up for this service')
.action(() => service.listEnv());

program
.command('fork <existingService> [newService]')
.description('fork <existingService> to <newServiceName>')
.action((existingService, newService) => service.fork(existingService, newService, account));

program
.command('download <serviceName>')
.description('download the code for a service that you own or that is public. <serviceName> can be the name of the service e.g. nicoslepicos/whois or a url to that service on clay.')
.action((serviceName) => account.download(serviceName));

program
.command('list')
.description('list services in your account')
.action(() => account.list());

program
.command('whoami')
.description('find out the account that you are logged in as')
.action(() => account.whoami());

program
.command('signup')
.description('signup to clay')
.action(() => account.signup());

program
.command('login')
.description('login to clay')
.action(() => account.login());

program
.command('help')
.description('show this help')
.action(() => program.outputHelp());

program.parse(process.argv);


if (!process.argv.slice(2).length || Object.prototype.toString.call(program.args[-1]) == '[object String]') {
  program.outputHelp();
  if(getClayConfig()) service.info();
}
