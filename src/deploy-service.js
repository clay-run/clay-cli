var path     = require('path')
 ,  exec     = require('child_process').exec
 ,  chalk    = require('chalk')
 ,  rp       = require('request-promise-native');

module.exports = function(deployConfig) {
  return new Promise((resolve, reject) =>  {

    if(deployConfig.mode=='PUT') console.log(chalk.white(`Updating Service...\n`))
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
        method: deployConfig.mode,
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
        if(response.result == true && deployConfig.mode =='PUT') console.log(chalk.white(`Service Updated.`))
          // Here also print out the url of the service
          resolve(response);
      })
      .catch((err) => {
        console.log(chalk.white(`Service failed to update. Please contact support@clay.run`))
        reject(err);
      })
    })
  })

}



