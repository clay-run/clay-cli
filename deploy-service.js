var path     = require('path')
 ,  exec     = require('child_process').exec
 ,  chalk    = require('chalk')
 ,  rp       = require('request-promise-native');

function Deployer (deployConfig) {
  this.credentials = deployConfig.credentials;
  this.mode = deployConfig.mode;
  this.api = deployConfig.api;
  this.dir = deployConfig.dir;
  this.clayConfig = deployConfig.clayConfig;
}

Deployer.prototype.deploy = function() {
  return new Promise((resolve, reject) =>  {

    if(this.mode=='PUT') console.log(chalk.white(`Updating Service...\n`))
    var currentProjectConfig = this.clayConfig || require(path.resolve(this.dir,  'clay-config.json'));
    var macCommand = 'zip -r  - node_modules *.* | base64';

    var execOptions = {
      maxBuffer: 1024 * 50000,
      cwd: this.dir
    }

    exec(macCommand, execOptions, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return
      }
      if (stderr) console.log(stderr);

      var options = {
        uri: this.api,
        method: this.mode,
        body: {
          commandDescription: currentProjectConfig.commandDescription,
          methodDisplayName: currentProjectConfig.methodDisplayName,
          commandName: currentProjectConfig.commandName,
          function_input: JSON.stringify(currentProjectConfig.inputs),
          apiToken: this.credentials.token,
          fileData: stdout
        },
        timeout: 0,
        json: true
      }

      rp(options)
      .then((response) => {
        if(response.result == true && this.mode =='PUT') console.log(chalk.white(`Service Updated.`))
          resolve(response);
      })
      .catch((err) => {
        reject(err);
      })
    })
  })

}
module.exports =  Deployer;



