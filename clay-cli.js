#! /usr/bin/env node

var program = require('commander');
var filePath = process.argv[1];
var fsSync = require('fs-sync');
var rp = require('request-promise-native');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');


program
  .version('0.0.1')
  .command('new <projectName>')
  .description('new command')
  .action(newCommand);

program
  .command('run')
  .description('runs command that is defined in the current directory against test data')
  .action(runCommand);

program
  .command('deploy')
  .description('deploys command that is definied in the current directory')
  .action(deployCommand);

program.parse(process.argv);



function newCommand(projectName) {
    // create a json file with name of command and name of project
    // make directory
  var dirPath = path.resolve(process.cwd(), `${projectName}`);
  console.log(`Creating Project: ${dirPath}`);
  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigPath = path.resolve(dirPath, '.clay-config.json');
  var clayConfigJson = {
    accountName: `public`,
    commandName: `${projectName}`,
    commandDescription: 'Enter your description here',
    inputs: [
      {
        "name": "customers",
        "type": "text",
        "displayName": "customers",
      },
      {"name": "insurances",
        "type": "db",
        "displayName": "insurances",
        "autocomplete": "insurances"
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

function deployCommand(dir, clayConfig, mode, cb) {
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
  console.log(deployDir);

  var currentProjectConfig = clayConfig || require(path.resolve(deployDir,  '.clay-config.json'));
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
      uri: 'http://localhost:4500/api/v1/projects/public/methods',
      method: mode,
      body: {
        commandDescription: currentProjectDesc,
        commandName: `${currentProjectName}`,
        function_input: JSON.stringify(currentProjectInputs),
        fileData: stdout
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
