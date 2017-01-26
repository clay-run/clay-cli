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

    const dir                     = deployConfig.dir
    const currentProjectConfig    = require(path.resolve(dir,  'clay-config.json'));
    const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)
    const SERVICE_URL_MSG         = chalk.white(`Your service is available here: `)+chalk.red(`${this.apis.servicePage}/${this.credentials.username}/${currentProjectConfig.serviceName}`)

    var execOptions = {
      maxBuffer: 1024 * 50000,
      cwd: dir
    };

    if(deployConfig.mode == 'PUT') print(UPDATING_SERVICE_MSG)

    exec(macCommand, execOptions, (err, stdout) => {
      if (err) {
        print(SERVICE_UPDATE_FAILED_MSG)
        return
      }

      var requestOptions = {
        uri: this.apis.methodsApi,
        method: deployConfig.mode ,
        body: {
          commandDescription: currentProjectConfig.serviceDescription,
          methodDisplayName: currentProjectConfig.serviceDisplayName,
          commandName: currentProjectConfig.serviceName,
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
          print(SERVICE_URL_MSG)
        }
          resolve(response);
      })
      .catch((err) => {
        if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
        else print(SERVICE_UPDATE_FAILED_MSG)
        reject(err);
      })
    })
  })

}



