var   path          = require('path')
 ,    fsSync        = require('fs-sync')
 ,    chalk         = require('chalk')
 ,    DeployFactory = require('./deploy-service.js')
 ,    print         = console.log
 ,    fs            = require('fs');

function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  this.api = serviceConfig.api;
  this.servicePage = serviceConfig.servicePage;
}

Service.prototype.create = function(serviceName) {
  const dir                          = path.resolve(process.cwd(), `${serviceName}`)
   ,    clayDir                      = path.resolve(__dirname)
   ,    packageTemplate              = path.resolve(clayDir,'clay-package-template.json')
   ,    commandFile                  = path.resolve(clayDir,'clay-template.js')
   ,    clayConfigPath               = path.resolve(dir, 'clay-config.json')
   ,    testDataPath                 = path.resolve(dir, 'test-data.json')
   ,    NO_SERVICE_NAME_ERR_MSG      = chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets.")
   ,    INVALID_SERVICE_NAME_ERR_MSG = chalk.white("You must enter a valid name for the service. Don't use spaces or special characters.")
   ,    DIR_EXISTS_ERR_MSG           = chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${dir}`)+chalk.white(` \n\nand try again.`)
   ,    CREATING_SERVICE_MSG         = chalk.white('Creating your service, one moment:\n')
   ,    SERVICE_EXISTS_ERR_MSG       = chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`)
   ,    SERVICE_NOT_CREATED          = chalk.white("Service was not created. Contact support@tryclay.com") + chalk.white(`\nCleaning up any files or directories that were created`)
   ,    SERVICE_CREATED_MSG          = `
${chalk.white('Your node service is now available.')}
${chalk.white('You can run your service by using the visual interface or by making an HTTP POST request to following url from your code:\n')}
${chalk.red('%s/%s/%s\n')}
${chalk.white('The code and configuration for the service is here:') + '\n' + chalk.red('%s\n')}
${chalk.white('To change the name, description and inputs that your service expects update:') + '\n' + chalk.red('%s/clayConfig.json\n')}
${chalk.white('To deploy run') +  chalk.red(' clay deploy ') + chalk.white('in the service directory\n')}
${chalk.white("That's all there is to it!\nFor more information and help go to")+chalk.red(' http://www.github.com/clay-run/clay-cli')} `;

  var clayConfigJson  = {
    accountName: `public`,
    commandName: `${serviceName}`,
    commandDescription: 'A service that takes in bits and moves atoms',
    inputs: [
      {
        "name": "varNameInCode",
        "type": "text",
        "displayName": "Human Readable Name of Variable"
      }
    ],
    methodDisplayName: `${serviceName}`
  };

  var testDataJson = {
    "varNameInCode": "testValueOfVar"
  }

  // Error checking must have a valid name and no directory with that name in folder
  if(!serviceName) {
    print(NO_SERVICE_NAME_ERR_MSG)
    return
  }

  if(process.argv[4]) {
    print(INVALID_SERVICE_NAME_ERR_MSG)
    return
  }

  if(!/^[!#$&-;=?-[\]_a-z~]+$/.test(serviceName)) {
    print(INVALID_SERVICE_NAME_ERR_MSG)
    return
  }

  if(!fs.existsSync(dir)) fs.mkdirSync(dir)
  else {
    print(DIR_EXISTS_ERR_MSG);
    return
  }

  // Copy files that come with the package as the template
  fsSync.copy(packageTemplate, path.resolve(dir, 'package.json'));
  fsSync.copy(commandFile, path.resolve(dir, `${serviceName}.js`));
  fs.writeFileSync(clayConfigPath, JSON.stringify(clayConfigJson, null, 2));
  fs.writeFileSync(testDataPath, JSON.stringify(testDataJson, null, 2));
  fs.mkdirSync(path.resolve(dir, 'node_modules'));

  print(CREATING_SERVICE_MSG);

  this.deployService = new DeployFactory({
    credentials: this.credentials,
    dir: dir,
    mode: 'POST',
    clayConfig: clayConfigJson,
    api: this.api
  });

  this.deployService.deploy()
  .then((deployResponse) => {
    print(SERVICE_CREATED_MSG, this.servicePage, this.credentials.username, serviceName, dir, dir);
  })
  .catch((err) => {
    if(err.statusCode == 409) print(SERVICE_EXISTS_ERR_MSG)
    else if(err.statusCode == 500) print(SERVICE_NOT_CREATED)
    fsSync.remove(dir);
  })

}

module.exports = Service;
