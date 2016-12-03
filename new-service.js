var   path          = require('path')
 ,    fsSync        = require('fs-sync')
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

  this.deployService = new DeployFactory({
    credentials: this.credentials,
    dir: this.dir,
    mode: 'POST',
    clayConfig: this.clayConfigJson,
    api: this.api
  });

  console.log(`Creating Service: ${this.dir}`);

  var clayDir =  path.resolve(__dirname);
  var packageTemplate = path.resolve(clayDir,'clay-package-template.json');
  var commandFile = path.resolve(clayDir,'clay-template.js');
  var clayConfigPath = path.resolve(this.dir, 'clay-config.json');

  if(!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
  fs.writeFileSync(clayConfigPath, JSON.stringify(this.clayConfigJson, null, 2));
  fs.mkdirSync(path.resolve(this.dir, 'node_modules'));
  // Copy files that come with the package as the template could also get them from the web
  fsSync.copy(packageTemplate, path.resolve(this.dir, 'package.json'));
  fsSync.copy(commandFile, path.resolve(this.dir, `${serviceName}.js`));
  setTimeout(() => this.deployService.deploy(), 2000);
}

module.exports = Service;


