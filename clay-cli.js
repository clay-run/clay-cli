#! /usr/bin/env node

var program = require('commander');
var filePath = process.argv[1];
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
  if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
  // make the correct files
  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigJson = {
    accountName: `apollo`,
    commandName: `${projectName}`,
    commandDescription: 'Enter your description here',
    inputs: [
      {
        "name": "customers",
          "type": "db",
          "displayName": "customers",
          "autocomplete": "customers"
      },
      {"name": "insurances",
        "type": "db",
        "displayName": "insurances",
        "autocomplete": "insurances"
      }
    ]
  };
  var clayConfigPath = path.resolve(dirPath, '.clay-config.json');
  fs.writeFileSync(clayConfigPath, JSON.stringify(clayConfigJson));
  // Copy files that come with the package as the template could also get them from the web
  copyFile(packageTemplate, path.resolve(dirPath, 'package.json'), (err) => {});
  copyFile(commandFile, path.resolve(dirPath, `${projectName}.js`), (err) => {});
  deployCommand(dirPath, clayConfigJson);
}

function runCommand() {
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
      done(err);
    });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
      done(err);
    });
  wr.on("close", function(ex) {
      done();
    });
  rd.pipe(wr);

  function done(err) {
      if (!cbCalled) {
            cb(err);
            cbCalled = true;
          }
    }
}

function deployCommand(dir, clayConfig) {
  // output of this is a stream that should just directly get piped to request to be sent up
  // based on the command name and project name
  // project is based on the current id of the company
  // var path = path.resolve(__dirname);
  var deployDir = dir || process.cwd()
  var currentProjectConfig = clayConfig || require(path.resolve(deployDir,  '/.clay-config.json'));
  var currentAccountName = currentProjectConfig.accountName;
  var currentProjectDesc = currentProjectConfig.commandDescription;
  var currentProjectName = currentProjectConfig.commandName;
  var currentProjectInputs = currentProjectConfig.inputs
  console.log(currentProjectConfig);
  var deployCommandUrl = `http://localhost:4500/api/v1/company/${currentAccountName}/command`
  var macCommand = 'zip -r  - node_modules *.* | base64';

  var execOptions = {
    maxBuffer: 1024 * 50000
  }

  exec(macCommand, execOptions, (err, stdout, stedrr) => {
    if (err) {
      console.log(err, stedrr);
      return
    }
    var options = {
      uri: deployCommandUrl,
      method: 'post',
      body: {
        commandDescription: currentProjectDesc,
        commandName: `${currentProjectName}`,
        function_input: null,
        fileData: stdout
      },
      timeout: 60000,
      json: true
    }
    console.log(options)
    rp(options)
    .then(function(result) {
      console.log(result);

    })
    .catch(function(err) {
      console.log(err);
    })

  })


}
