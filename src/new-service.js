var   path                 = require('path')
  ,    chalk                = require('chalk')
  ,    print                = console.log
  ,    clayConfigFactory    = require('./clay-config-generator')
  ,    exec                 = require('child-process-promise').exec
  ,    clayTestDataFactory  = require('./clay-test-data-generator')
  ,    clayNodePckgFactory  = require('./clay-node-package-generator')
  ,    fs                   = require('fs-extra-promise')
  ,    inquirer             = require('inquirer')
  ,    clui                 = require('clui');


module.exports = function(serviceName) {
  var clayConfigJson;
  var testDataJson;
  var packageJson;
  var commandFile;
  var templateMessages;

  const INVALID_SERVICE_NAME_ERR_MSG = chalk.red("You must enter a valid name for the service. Only use lower case letters, numbers, dashes or an underscore.")

  inquirer.prompt([{
    name: 'serviceName',
    message: 'What is the name of the service?',
    validate: function(value) {
      if(value.length) {
        if(!/^[-0-9_a-z~]+$/.test(value)) {
          return INVALID_SERVICE_NAME_ERR_MSG;
        }
        return true;
      } else {
        return 'The name of your service cannot be empty.';
      }
    }
  }, {
    name: 'templateName',
    type: 'list',
    choices: [
      'microservice (default)',
      'alexa'
    ],
    message: 'Which template do you want to use (press enter for default)'
  }])
  .then((answers) => {
    const   clayDir                      = path.resolve(__dirname, '..')
      ,       serviceName                  = answers.serviceName
      ,       templateName                 = answers.templateName
      ,       dir                          = path.resolve(process.cwd(), `${serviceName}`)
      ,       NO_SERVICE_NAME_ERR_MSG      = chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets.")
      ,       DOCS_LINK                    = 'https://www.clay.run/docs'
      ,       SERVICE_NOT_CREATED          = chalk.white("Service was not created. Contact support@tryclay.com") + chalk.white(`\nCleaning up any files or directories that were created`)
      ,       packagePath                  = path.resolve(dir, 'package.json')
      ,       clayConfigPath               = path.resolve(dir, 'clay-config.json')
      ,       testDataPath                 = path.resolve(dir, 'test-data.json')
      ,       SERVICE_EXISTS_ERR_MSG       = chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`)
      ,       DIR_EXISTS_ERR_MSG           = chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${dir}`)+chalk.white(` \n\nand try again.`);

    // Error checking must have a valid name and no directory with that name in folder
    if(!serviceName) {
      print(NO_SERVICE_NAME_ERR_MSG)
      return
    }

    if(!/^[-0-9_a-z~]+$/.test(serviceName)) {
      print(INVALID_SERVICE_NAME_ERR_MSG)
      return
    }

    if(!fs.existsSync(dir)) fs.mkdirSync(dir)
    else {
      print(DIR_EXISTS_ERR_MSG);
      return
    }

    switch(templateName) {
      case 'alexa':
        clayConfigJson  = clayConfigFactory.alexaTemplate(serviceName, 'alexa', this.credentials.username);
        testDataJson = clayTestDataFactory.alexaTemplate();
        packageJson = clayNodePckgFactory.alexaTemplate(clayConfigJson, this.credentials.username);
        commandFile = path.resolve(clayDir,'templates/clay-alexa-template.js')
        templateMessages = require('../templates/clay-alexa-node-text.js');
        break;
      default:
        clayConfigJson  = clayConfigFactory.defaultTemplate(serviceName, 'microservice', this.credentials.username);
        testDataJson = clayTestDataFactory.defaultTemplate();
        packageJson = clayNodePckgFactory.defaultTemplate(clayConfigJson, this.credentials.username);
        commandFile = path.resolve(clayDir,'templates/clay-node-template.js')
        templateMessages = require('../templates/clay-microservices-node-text.js');
        break;
    }


    // Copy files that come with the package as the template
    Spinner = clui.Spinner;
    var status = new Spinner('Creating service configuration file..');
    status.start();

    fs.copyAsync(commandFile, path.resolve(dir, `index.js`))
      .then(() => {
        status.message('Writing Clay configuration file..');
        return fs.writeFileAsync(clayConfigPath, JSON.stringify(clayConfigJson, null, 2));
      })
      .then(() => {
        status.message('Writing test data file..');
        return fs.writeFileAsync(testDataPath, JSON.stringify(testDataJson, null, 2));
      })
      .then(() => {
        status.message('Writing npm package file..');
        return fs.writeFileAsync(packagePath, JSON.stringify(packageJson, null, 2));
      })
      .then(() => {
        status.message('Creating npm_modules..');
        return fs.mkdirAsync(path.resolve(dir, 'node_modules'));
      })
      .then(() => {
        status.message('Installing modules..');
        return exec('npm install', {cwd: dir})
      })
      .then((result) => {
        status.message('Deploying your service..');
        // Set the directory to act on as the new service directory
        return this.deploy({mode: 'POST', dir: dir})
      })
      .then((deployResponse) => {
        status.stop();
        var urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
        print(templateMessages.serviceCreated(urlForService, dir, DOCS_LINK+'/tutorial'));
      })
      .catch((err) => {
        status.stop();
        if(process.env.CLAY_DEV) console.log(err);
        if(err && !err.statusCode) print(SERVICE_NOT_CREATED)
        else if(err.statusCode == 409) print(SERVICE_EXISTS_ERR_MSG)
        else if(err.statusCode == 500) print(SERVICE_NOT_CREATED)
        fs.removeSync(dir);
      })
  })
}
