var   path          = require('path')
 ,    fsSync        = require('fs-sync')
 ,    chalk         = require('chalk')
 ,    DeployFactory = require('./deploy-service.js')
 ,    fs            = require('fs');


function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  this.api = serviceConfig.api;
  this.servicePage = serviceConfig.servicePage;
}

Service.prototype.create = function(serviceName) {

  if(!serviceName) {
    console.log(chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets."))
    return
  }
  if(/^[!#$&-;=?-[]_a-z~]+$/.test(serviceName)) {
    console.log("You must enter a valid name for the service")
    return
  }

  this.dir = path.resolve(process.cwd(), `${serviceName}`);
  this.clayConfigJson = {
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


  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigPath = path.resolve(this.dir, 'clay-config.json');

  if(!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
  else {
    // if directory exists return with an error
    console.log(chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${this.dir}`)+chalk.white(` \n\nand try again.`));
    process.exit();
  }
  fsSync.copy(packageTemplate, path.resolve(this.dir, 'package.json'));
  fsSync.copy(commandFile, path.resolve(this.dir, `${serviceName}.js`));
  fs.writeFileSync(clayConfigPath, JSON.stringify(this.clayConfigJson, null, 2));
  fs.mkdirSync(path.resolve(this.dir, 'node_modules'));
  // Copy files that come with the package as the template could also get them from the web
  console.log(chalk.white('Creating your service, one moment:\n'));
  setTimeout(() => {
    this.deployService = new DeployFactory({
      credentials: this.credentials,
      dir: this.dir,
      mode: 'POST',
      clayConfig: this.clayConfigJson,
      api: this.api
    });
    this.deployService.deploy()
    .then((deployResponse) => {
      console.log(chalk.white(`Your node service is now available.`))
      console.log(chalk.white(`You can run your service by using the visual interface or by making an HTTP POST request to following url from your code:\n`));
      console.log(chalk.red(`${this.servicePage}/${deployResponse.user.username}/${serviceName}\n`));
      console.log(chalk.white('The code and configuration for the service is here:') + '\n' + chalk.red(`${this.dir}\n`));
      console.log(chalk.white(`To change the name, description and inputs that your service expects update:`) + `\n` + chalk.red(`${this.dir}/clayConfig.json\n`));
      console.log(chalk.white(`To deploy run`) +  chalk.red(` clay deploy `) + chalk.white(`in the service directory\n`));
      console.log(chalk.white(`That's all there is to it!\nFor more information and help go to`)+chalk.red(` http://www.github.com/clay-run/clay-cli`));
    })
    .catch((err) => {
      if(err.statusCode == 409) console.log(chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`))
      else if(err.statusCode == 500) console.log("Service was not created. Contact support@tryclay.com")
      fsSync.remove(this.dir);
    })
  }, 2000);

}

module.exports = Service;


