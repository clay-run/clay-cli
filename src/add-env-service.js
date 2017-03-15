var path                      = require('path')
 ,  chalk                     = require('chalk')
 ,  rp                        = require('request-promise-native')
 ,  print                     = console.log
 ,  UPDATING_SERVICE_MSG      = chalk.white(`Updating Environment Variables...\n`)
 ,  SERVICE_UPDATED_MSG       = chalk.white(`Service Updated.`)
 ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`);

module.exports = function(key, value) {

  const currentProjectConfig = require(path.resolve(process.cwd(), 'clay-config.json'))
  const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)

  print(chalk.white(UPDATING_SERVICE_MSG));
  if(!key || !value) {
    print(chalk.white(SERVICE_UPDATE_FAILED_MSG));
    process.exit();
  }


  var listOptions = {
    uri: this.apis.methodsApi+`/${this.credentials.username}-${currentProjectConfig.serviceName}`,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(listOptions)
  .then((response) => {
    var envVars = response.envVars || {};
    envVars[key] = value;
    var requestOptions = {
      uri: this.apis.methodsApi,
      method: 'PUT',
      body: {
        commandName: currentProjectConfig.serviceName,
        envVars: envVars,
        apiToken: this.credentials.token
      },
      timeout: 0,
      json: true
    }
    return rp(requestOptions);
  })
  .then((response) => {
    if(response.result == true) {
      var time = new Date();
      print(SERVICE_UPDATED_MSG, time.toLocaleDateString(), time.toLocaleTimeString())
    }
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
      else print(SERVICE_UPDATE_FAILED_MSG)
  })

}



