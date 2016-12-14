var   path          = require('path')
 ,    fsSync        = require('fs-sync')
 ,    chalk         = require('chalk')
 ,    DeployFactory = require('./deploy-service.js')
 ,    fs            = require('fs');


function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  this.api = serviceConfig.api
}

Service.prototype.create = function(serviceName) {

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
        "name": "customers",
        "type": "text",
        "displayName": "customers"
      }
    ],
    methodDisplayName: `${serviceName}`
  };


  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigPath = path.resolve(this.dir, 'clay-config.json');

  if(!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
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
      console.log(chalk.white('Your node service was created here:') + '\n' + chalk.red(`${deployResponse.url}`));
      console.log(chalk.white('Your node service is available at this url:') + '\n' + chalk.red(`${this.dir}\n`));
      console.log(chalk.white(`To change the name, description and inputs that your service expects update:`) + `\n` + chalk.red(`${this.dir}\\clayConfig.json\n`));
      console.log(chalk.white(`To deploy run`) +  chalk.red(` clay deploy `) + chalk.white(`in the service directory\n`));
      console.log(chalk.white(`That's all there is to it!`));
    })
    .catch((err) => {
      console.log(err);
      console.log("Service did not update. Contact support@tryclay.com")
    })
  }, 2000);

}

module.exports = Service;


