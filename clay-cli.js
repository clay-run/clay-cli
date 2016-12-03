#! /usr/bin/env node
var   program           = require('commander')
 ,    path              = require('path')
 ,    getCredentials    = require('./get-credentials.js')
 ,    createCredentials = require('./create-credentials.js')
 ,    ServiceFactory    = require('./new-service.js')
 ,    authCredentials   = require('./authorize-credentials.js')
 ,    os                = require('os')
 ,    DeployFactory     = require('./deploy-service.js');

var clayApi = (process.env.CLAY_DEV) ? 'http://localhost:4500' : 'https://tryclay.com';

const signupApi = `${clayApi}/api/v1/signup`;
const methodsApi = `${clayApi}/api/v1/projects/public/methods`;
const authorizeApi = `${clayApi}/api/v1/login`;

// read credentials if not available signup or login
var clayCredentialsDir = path.resolve(os.homedir(), '.clay');

// get credentials if not login or signup command
if(!(process.argv[2] == 'login' || process.argv[2] == 'signup')) {
  var clayCredentials = getCredentials(clayCredentialsDir);
}

var deployService = new DeployFactory({
  credentials: clayCredentials,
  dir: process.cwd(),
  mode: 'put',
  clayConfig: null,
  api: methodsApi
});

var newService = new ServiceFactory({
  credentials: clayCredentials,
  api: methodsApi
})

program
.version('0.0.1')
.command('new <serviceName>')
.description('new service')
.action((projectName) => newService.create(projectName));

program
.command('deploy')
.description('deploys service that is defined in the current directory')
.action(() => deployService.deploy());

program
.command('signup')
.description('signup to clay')
.action(() => createCredentials(signupApi, clayCredentialsDir));

program
.command('login')
.description('login to clay')
.action(() => authCredentials(authorizeApi, clayCredentialsDir));

// program
//   .command('run')
//   .description('runs service that is defined in the current directory against test data')
//   .action(runCommand);
program.parse(process.argv);








