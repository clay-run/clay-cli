var path                      = require('path')
  , chalk                     = require('chalk')
  , rp                        = require('request-promise-native')
  , print                     = console.log
  , UPDATING_SERVICE_MSG      = () => print(chalk.white(`Updating Environment Variables...\n`))
  , SERVICE_UPDATED_MSG       = (time) => print(chalk.white(`Service Updated. ${time.toLocaleTimeString()} ${time.toLocaleDateString()}`))
  , NO_KEY_MSG                = () => print(chalk.white(`You must enter a private environment variable to update`))
  , NO_VALUE_MSG              = () => print(chalk.white(`Deleting the value for that private key\n`))
  , GETTING_VARS_MSG          = () => print(chalk.white(`Getting Environment Variables...\n`))
  , NO_ENV_VARS_MSG           = () => print(chalk.white(`No Environment Variables\n`))
  , CURRENT_ENV_VARS_MSG      = (envVars) => print(chalk.white(`The environment variables are: ${JSON.stringify(envVars, null, 2)}\n`))
  , USER_NOT_AUTHORIZED_ERR   = (currentUser) => print(chalk.white(`Current user is not authorized to create or update this service. You are signed as: `)+chalk.red(`${currentUser}`))
  , SERVICE_UPDATE_FAILED_MSG = () => print(chalk.white(`Service failed to update. Please contact support@clay.run`));

module.exports = function(fn, key, value) {

  const currentProjectConfig = require(path.resolve(process.cwd(), 'clay-config.json'))
  const currentUser = this.credentials.username
  const username = currentProjectConfig.username || currentUser
  const serviceName = `${username}-${currentProjectConfig.serviceName}`
  const getPrivateVarApi = this.apis.privateVarApi+`/${serviceName}`;
  const deployPrivateVarApi = this.apis.deployApi;
  const apiToken = this.credentials.token;

  if(fn == 'list') GETTING_VARS_MSG();
  else UPDATING_SERVICE_MSG();

  getPrivateEnvVars(getPrivateVarApi, apiToken)
  .then((response) => {
    if(fn == 'list') {
      if(response.envVars) CURRENT_ENV_VARS_MSG(response.envVars)
      else NO_ENV_VARS_MSG()
      process.exit();
    } else {
      return modifyEnvVars(key, value, response.envVars, serviceName, deployPrivateVarApi, apiToken)
    }
  })
  .then((modifyResponse) => {
    var time = new Date();
    var [modifyFunctionResult, envVars] = modifyResponse
    CURRENT_ENV_VARS_MSG(envVars);
    SERVICE_UPDATED_MSG(new Date)
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    if(err.statusCode == 401 || err.statusCode == 400) USER_NOT_AUTHORIZED_ERR(currentUser)
    else SERVICE_UPDATE_FAILED_MSG()
  })
}

function modifyEnvVars(key, value, envVars, serviceName, deployPrivateVarApi, apiToken) {
  if(!key) {
    NO_KEY_MSG();
    process.exit();
  }
  if(!value) {
    NO_VALUE_MSG();
  }

  envVars = envVars || {};
  if(!value) delete envVars[key]
  else envVars[key] = value;
  const requestOptions = {
    uri: deployPrivateVarApi,
    method: 'POST',
    body: {
      envVars: envVars,
      serviceName: serviceName,
      apiToken: apiToken
    },
    timeout: 0,
    json: true
  }
  return Promise.all([rp(requestOptions), Promise.resolve(envVars)])

}

function getPrivateEnvVars(getPrivateVarApi, apiToken) {
  const listOptions = {
    uri: getPrivateVarApi,
    method: 'GET',
    qs: {
      apiToken: apiToken
    },
    timeout: 0,
    json: true
  }
  return rp(listOptions)
}



