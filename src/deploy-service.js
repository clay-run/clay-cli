var path                       = require('path')
  ,  fs                        = require('fs-extra')
  ,  exec                      = require('child_process').exec
  ,  chalk                     = require('chalk')
  ,  rp                        = require('request-promise-native')
  ,  print                     = console.log
  ,  AdmZip                    = require('adm-zip')
  ,  UPDATING_SERVICE_MSG      = chalk.white(`Updating Service...\n`)
  ,  SERVICE_UPDATED_MSG       = chalk.green(`✅ Service Updated.`)
  ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`)
  ,  clui                      = require('clui')
  ,  Spinner                   = clui.Spinner;

module.exports = function(deployConfig) {
  return new Promise((resolve, reject) =>  {

    const dir                     = deployConfig.dir
    const currentProjectConfig    = require(path.resolve(dir,  'clay-config.json'));
    const USER_NOT_AUTHORIZED_ERR = chalk.white(`The current user is not authorized to create or update this service. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)
    const SERVICE_URL_MSG         = chalk.white(`🚀 Your service is available here: `)+chalk.green.underline(`${this.apis.servicePage}/${this.credentials.username}/${currentProjectConfig.serviceName}`)

    var execOptions = {
      maxBuffer: 1024 * 50000,
      cwd: dir
    };

    var status = new Spinner('Verifying config file');
    status.start();


    status.message('Building your service..');
    var zip = new AdmZip();


    zip.addLocalFolder(deployConfig.dir)

    var zipPromise = new Promise((resolve, reject) => {
      zip.toBuffer((buffer, err) => {
        if(err) reject(err)
        resolve(buffer)
      })

    })

    this.lintConfig(deployConfig.dir, true)
    .then(() => {
      return zipPromise
    })
    .then((zipBuffer) => {
      status.message('Deploying ' + currentProjectConfig.serviceDisplayName + ' on Clay Cloud..');
      var requestOptions = {
        uri: this.apis.methodsApi,
        method: deployConfig.mode ,
        body: {
          commandDescription: currentProjectConfig.serviceDescription,
          methodDisplayName: currentProjectConfig.serviceDisplayName,
          commandName: currentProjectConfig.serviceName,
          function_input: JSON.stringify(currentProjectConfig.inputs),
          apiToken: this.credentials.token,
          serviceType: currentProjectConfig.serviceType,
          fileData: zipBuffer.toString('base64')
        },
        timeout: 0,
        json: true
      }
      return rp(requestOptions)
    })
    .then((response) => {
      status.stop();
      if(response.result == true && deployConfig.mode  == 'PUT') {
        var time = new Date();
        if(!deployConfig.suppressProgressMessages) {
          print(SERVICE_UPDATED_MSG, time.toLocaleDateString(), time.toLocaleTimeString())
        }
        print(SERVICE_URL_MSG)
      }
      resolve(response);
    })
    .catch((err) => {
      status.stop();
      if(process.env.CLAY_DEV) console.log(err);
      if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
      else if(deployConfig.mode == 'PUT') print(SERVICE_UPDATE_FAILED_MSG)
    })
  })
}



