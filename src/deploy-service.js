var path                      = require('path')
 ,  exec                      = require('child_process').exec
 ,  chalk                     = require('chalk')
 ,  rp                        = require('request-promise-native')
 ,  print                     = console.log
 ,  macCommand                = 'zip -r  - node_modules *.* | base64'
 ,  UPDATING_SERVICE_MSG      = chalk.white(`Updating Service...\n`)
 ,  SERVICE_UPDATED_MSG       = chalk.white(`Service Updated.`)
 ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`);

module.exports = function(deployConfig) {
  return new Promise((resolve, reject) =>  {

    var dir = deployConfig.dir
    var currentProjectConfig = require(path.resolve(dir,  'clay-config.json'));
    var execOptions = {
      maxBuffer: 1024 * 50000,
      cwd: dir
    };

    if(deployConfig.mode == 'PUT') print(UPDATING_SERVICE_MSG)

    exec(macCommand, execOptions, (err, stdout, stderr) => {
      if (err) {
        print(SERVICE_UPDATE_FAILED_MSG)
        return
      }

      print(stderr)

      var requestOptions = {
        uri: this.apis.methodsApi,
        method: deployConfig.mode ,
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

      rp(requestOptions)
      .then((response) => {
        if(response.result == true && deployConfig.mode  == 'PUT') {
          print(SERVICE_UPDATED_MSG)
        }
          resolve(response);
      })
      .catch((err) => {
        print(SERVICE_UPDATE_FAILED_MSG)
        reject(err);
      })
    })
  })

}



