var   path                 = require('path')
 ,    chalk                = require('chalk')
 ,    print                = console.log
 ,    clayConfigFactory    = require('./clay-config-generator')
 ,    exec                 = require('child_process').exec
 ,    clayTestDataFactory  = require('./clay-test-data-generator')
 ,    clayNodePckgFactory  = require('./clay-node-package-generator')
 ,    fs                   = require('fs-extra');


module.exports = function(serviceName, templateName) {
  const dir                          = path.resolve(process.cwd(), `${serviceName}`)
   ,    clayDir                      = path.resolve(__dirname, '..')
   ,    packagePath                  = path.resolve(dir, 'package.json')
   ,    clayConfigPath               = path.resolve(dir, 'clay-config.json')
   ,    testDataPath                 = path.resolve(dir, 'test-data.json')
   ,    NO_SERVICE_NAME_ERR_MSG      = chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets.")
   ,    INVALID_SERVICE_NAME_ERR_MSG = chalk.white("You must enter a valid name for the service. Only use letters, numbers, dashes or an underscore.")
   ,    DIR_EXISTS_ERR_MSG           = chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${dir}`)+chalk.white(` \n\nand try again.`)
   ,    CREATING_SERVICE_MSG         = chalk.white('Creating your service, one moment:\n')
   ,    SERVICE_EXISTS_ERR_MSG       = chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`)
   ,    SERVICE_NOT_CREATED          = chalk.white("Service was not created. Contact support@tryclay.com") + chalk.white(`\nCleaning up any files or directories that were created`)
   ,    SERVICE_CREATED_MSG          = `
${chalk.white('Your node service is now live and deployed.\n')}
${chalk.white('URL FOR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.red('%s\n')}
${chalk.white('EDIT CODE AND CONFIGURE SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('The next step is to edit the code and configuration for your service which is here:') + '\n' + chalk.red('%s\n')}
${chalk.white('After you make changes test it locally using:\n') +  chalk.red('clay test \n')}
${chalk.white('DEPLOY YOUR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('Then you can deploy it to production using:\n') +  chalk.red('clay deploy \n')}
${chalk.white('RUN YOUR SERVICE (ONLY RESPONDS TO POST REQUESTS):')}
${chalk.white('******************************************\n')}
${chalk.white('You can run your service by using the visual interface or by making an HTTP POST request to following url from your code:')}
${chalk.red('%s\n')}
${chalk.white('You can also run it on production using:\n') +  chalk.red('clay run \n')}
${chalk.white("That's all there is to it! For more information and help go to")+chalk.red(' http://www.github.com/clay-run/clay-cli')} `;

  var clayConfigJson;
  var testDataJson;
  var packageJson;
  var commandFile;


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
      clayConfigJson  = clayConfigFactory.alexaTemplate(serviceName);
      testDataJson = clayTestDataFactory.alexaTemplate();
      packageJson = clayNodePckgFactory.alexaTemplate(clayConfigJson, this.credentials.username);
      commandFile = path.resolve(clayDir,'templates/clay-alexa-template.js')
      break;
    default:
      clayConfigJson  = clayConfigFactory.defaultTemplate(serviceName);
      testDataJson = clayTestDataFactory.defaultTemplate();
      packageJson = clayNodePckgFactory.defaultTemplate(clayConfigJson, this.credentials.username);
      commandFile = path.resolve(clayDir,'templates/clay-node-template.js')
      break;
  }


  // Copy files that come with the package as the template
  fs.copySync(commandFile, path.resolve(dir, `${serviceName}.js`));
  fs.writeFileSync(clayConfigPath, JSON.stringify(clayConfigJson, null, 2));
  fs.writeFileSync(testDataPath, JSON.stringify(testDataJson, null, 2));
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  fs.mkdirSync(path.resolve(dir, 'node_modules'));
  exec('npm install', {cwd: dir}, (err) => {
    if(err) print(SERVICE_NOT_CREATED)
  })

  print(CREATING_SERVICE_MSG);

  // Set the directory to act on as the new service directory
  this.deploy({mode: 'POST', dir: dir})
  .then((deployResponse) => {
    var urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
    print(SERVICE_CREATED_MSG, urlForService, dir, urlForService);
  })
  .catch((err) => {
    if(err.statusCode == 409) print(SERVICE_EXISTS_ERR_MSG)
    else if(err.statusCode == 500) print(SERVICE_NOT_CREATED)
    fs.removeSync(dir);
  })

}
