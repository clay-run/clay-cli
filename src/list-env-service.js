var path                      = require('path')
 ,  chalk                     = require('chalk')
 ,  rp                        = require('request-promise-native')
 ,  print                     = console.log
 ,  UPDATING_SERVICE_MSG      = chalk.white(`Getting Environment Variables...\n`)
 ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`);

module.exports = function() {

  const currentProjectConfig = require(path.resolve(process.cwd(), 'clay-config.json'))
  const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to get, create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)

  console.log(chalk.white(UPDATING_SERVICE_MSG));

  var requestOptions = {
    uri: this.apis.methodsApi+`/${this.credentials.username}-${currentProjectConfig.serviceName}`,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(requestOptions)
  .then((response) => {
    console.log(JSON.stringify(response.envVars, null, 2))
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
    else print(SERVICE_UPDATE_FAILED_MSG)
  })

}



