#! /usr/bin/env node

const program  = require('commander'),
      fsSync   = require('fs-sync'),
      rp       = require('request-promise-native'),
      exec     = require('child_process').exec,
      path     = require('path'),
      fs       = require('fs'),
      os       = require('os'),
      inquirer = require('inquirer');

// check for credentials if not there save them

const signupApi = 'http://localhost:4500/api/v1/signup';
const methodsApi = 'http://localhost:4500/api/v1/projects/public/methods';

// Get credentials if they are not available
var clayCredentialsDir = path.resolve(os.homedir(), '.clay')
if(!fs.existsSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'))){
  // create dir and create credentials
  if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)
  // Prompt and write
  var email = {
    type: 'input',
    name: 'email',
    message: 'Enter your email address',
    valid: function(email) {
      if(email === '') 'please enter an email'
      else return true
    }
  };
  var password = {
    type: 'password',
    name: 'password',
    message: 'Enter a password',
    valid: function(password) {
      if(password === '') 'please enter a password'
      else return true
    }
  };
  var username = {
    type: 'input',
    name: 'username',
    message: 'Enter a username',
    valid: function(username) {
      if(username === '') 'please enter a username'
      else return true
    }
  }
  // make a call to get a unique token that gets saved and used in future calls

  inquirer.prompt([email, password, username])
  .then(function (answers) {
    var requestOptions = {
      uri: signupApi,
      method: 'post',
      body: {
        email: answers.email,
        password: answers.password,
        username: answers.username
      },
      timeout: 0,
      json: true
    }
    rp(requestOptions)
    .then((signupResult) => {
      fs.writeFileSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'), JSON.stringify(signupResult, null, 2));
    })
    .catch((err) => {
      console.log(err);
    })
  });
} else {
  // Read the credentials and make it global for cli
  const clayCredentials = require(path.resolve(clayCredentialsDir, 'clayCredentials.json'));
}


program
  .version('0.0.1')
  .command('new <projectName>')
  .description('new service')
  .action(newCommand);

program
  .command('run')
  .description('runs service that is defined in the current directory against test data')
  .action(runCommand);

program
  .command('deploy')
  .description('deploys service that is defined in the current directory')
  .action(deployCommand);

program.parse(process.argv);


function createAccount(accountName) {
}

function newCommand(projectName) {
    // create a json file with name of command and name of project
    // make directory
  var dirPath = path.resolve(process.cwd(), `${projectName}`);
  console.log(`Creating Project: ${dirPath}`);
  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigPath = path.resolve(dirPath, 'clay-config.json');

  var clayConfigJson = {
    accountName: `public`,
    commandName: `${projectName}`,
    commandDescription: 'Enter your description here',
    inputs: [
      {
        "name": "customers",
        "type": "text",
        "displayName": "customers"
      }
    ]
  };

  if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
  fs.writeFileSync(clayConfigPath, JSON.stringify(clayConfigJson, null, 2));
  fs.mkdirSync(path.resolve(dirPath, 'node_modules'));
  // Copy files that come with the package as the template could also get them from the web
  fsSync.copy(packageTemplate, path.resolve(dirPath, 'package.json'));
  fsSync.copy(commandFile, path.resolve(dirPath, `${projectName}.js`));
  setTimeout(() => deployCommand(dirPath, clayConfigJson, 'post'), 2000);

}



function runCommand() {
}

function deployCommand(dir, clayConfig, mode) {
  // output of this is a stream that should just directly get piped to request to be sent up
  // based on the command name and project name
  // project is based on the current id of the company
  // var path = path.resolve(__dirname);
  if(dir !== null && typeof dir === 'object') {
    dir = process.cwd();
  }
  var deployDir = dir;
  if(!mode) {
    mode = 'put'
  }

  var currentProjectConfig = clayConfig || require(path.resolve(deployDir,  'clay-config.json'));
  var currentAccountName = currentProjectConfig.accountName;
  var currentProjectDesc = currentProjectConfig.commandDescription;
  var currentProjectName = currentProjectConfig.commandName;
  var currentProjectInputs = currentProjectConfig.inputs
  var macCommand = 'zip -r  - node_modules *.* | base64';

  var execOptions = {
    maxBuffer: 1024 * 50000,
    cwd: deployDir
  }

  exec(macCommand, execOptions, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return
    }
    if (stderr) console.log(stderr);
    var options = {
      uri: methodsApi,
      method: mode,
      body: {
        commandDescription: currentProjectDesc,
        commandName: `${currentProjectName}`,
        function_input: JSON.stringify(currentProjectInputs),
        fileData: stdout,
        clayUser: clayCredentials
      },
      timeout: 0,
      json: true
    }
    rp(options)
    .then(function(result) {
      console.log(result);
    })
    .catch(function(err) {
      console.log("Unfortunately Clay hit a brick wall. Contact support@claylabshq.com");
    })
  })



}
