var   path                 = require('path')
 ,    chalk                = require('chalk')
 ,    print                = console.log
 ,    clayConfigFactory    = require('./clay-config-generator')
 ,    exec                 = require('child-process-promise').exec
 ,    clayTestDataFactory  = require('./clay-test-data-generator')
 ,    clayNodePckgFactory  = require('./clay-node-package-generator')
,     fs                   = require('fs-extra-promise');


module.exports = function(serviceName, templateName) {
  const dir                          = path.resolve(process.cwd(), `${this.credentials.username}-${serviceName}`)
   ,    clayDir                      = path.resolve(__dirname, '..')
   ,    packagePath                  = path.resolve(dir, 'package.json')
   ,    clayConfigPath               = path.resolve(dir, 'clay-config.json')
   ,    testDataPath                 = path.resolve(dir, 'test-data.json')
   ,    NO_SERVICE_NAME_ERR_MSG      = chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets.")
   ,    INVALID_SERVICE_NAME_ERR_MSG = chalk.white("You must enter a valid name for the service. Only use lower case letters, numbers, dashes or an underscore.")
   ,    DIR_EXISTS_ERR_MSG           = chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${dir}`)+chalk.white(` \n\nand try again.`)
   ,    CREATING_SERVICE_MSG         = chalk.white('Creating your service, one moment:\n')
   ,    SERVICE_EXISTS_ERR_MSG       = chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`)
   ,    DOCS_LINK                    = 'https://www.clay.run/docs'
   ,    SERVICE_NOT_CREATED          = chalk.white("Service was not created. Contact support@tryclay.com") + chalk.white(`\nCleaning up any files or directories that were created`)

  var clayConfigJson;
  var testDataJson;
  var packageJson;
  var commandFile;
  var templateMessages;


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

  switch(templateName.template) {
    case 'alexa':
      clayConfigJson  = clayConfigFactory.alexaTemplate(serviceName, 'alexa');
      testDataJson = clayTestDataFactory.alexaTemplate();
      packageJson = clayNodePckgFactory.alexaTemplate(clayConfigJson, this.credentials.username);
      commandFile = path.resolve(clayDir,'templates/clay-alexa-template.js')
      templateMessages = require('../templates/clay-alexa-node-text.js');
      break;
    default:
      clayConfigJson  = clayConfigFactory.defaultTemplate(serviceName, 'microservice');
      testDataJson = clayTestDataFactory.defaultTemplate();
      packageJson = clayNodePckgFactory.defaultTemplate(clayConfigJson, this.credentials.username);
      commandFile = path.resolve(clayDir,'templates/clay-node-template.js')
      templateMessages = require('../templates/clay-microservices-node-text.js');
      break;
  }


  // Copy files that come with the package as the template
  print(CREATING_SERVICE_MSG);

  fs.copyAsync(commandFile, path.resolve(dir, `index.js`))
  .then(() => {
    return fs.writeFileAsync(clayConfigPath, JSON.stringify(clayConfigJson, null, 2));
  })
  .then(() => {
    return fs.writeFileAsync(testDataPath, JSON.stringify(testDataJson, null, 2));
  })
  .then(() => {
   return fs.writeFileAsync(packagePath, JSON.stringify(packageJson, null, 2));
  })
  .then(() => {
    return fs.mkdirAsync(path.resolve(dir, 'node_modules'));
  })
  .then(() => {
    return exec('npm install', {cwd: dir})
  })
  .then((result) => {
    // Set the directory to act on as the new service directory
    return this.deploy({mode: 'POST', dir: dir})
  })
  .then((deployResponse) => {
    var urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
    print(templateMessages.serviceCreated(urlForService, dir, DOCS_LINK+'/tutorial'));
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    if(err && !err.statusCode) print(SERVICE_NOT_CREATED)
    else if(err.statusCode == 409) print(SERVICE_EXISTS_ERR_MSG)
    else if(err.statusCode == 500) print(SERVICE_NOT_CREATED)
    fs.removeSync(dir);
  })
}
