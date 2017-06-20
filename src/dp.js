var path                       = require('path')
  ,  fs                        = require('fs-extra')
  ,  chalk                     = require('chalk')
  ,  rp                        = require('request-promise-native')
  ,  print                     = console.log
  ,  AdmZip                    = require('adm-zip')
  ,  clui                      = require('clui')
  ,  sha                       = require('crypto-js/sha256')
  ,  UPDATING_SERVICE_MSG      = chalk.white(`Updating Service...\n`)
  ,  SERVICE_UPDATED_MSG       = chalk.green(`✅ Service Updated.`)
  ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`)
  ,  Spinner                   = clui.Spinner;

module.exports = function(deployConfig) {
  return new Promise((resolve, reject) =>  {

    const dir                     = deployConfig.dir
    const clayConfig              = require(path.resolve(dir,  'clay-config.json'));
    const packageJson             = require((path.resolve(dir, 'package.json')));
    const packageHash             = sha(JSON.stringify(packageJson.dependencies)).toString();
    const USER_NOT_AUTHORIZED_ERR = chalk.white(`The current user is not authorized to create or update this service. You are signed as: `)+chalk.red(`${this.credentials.username}\n`);
    const SERVICE_URL_MSG         = chalk.white(`🚀 Your service is available here: `)+chalk.green.underline(`${this.apis.servicePage}/${this.credentials.username}/${clayConfig.serviceName}`);

    var status = new Spinner('Verifying config file');
    status.start();


    status.message('Building your service..');
    var zip = new AdmZip();

    // get list of all file names other than node_modules
    var dirFiles = fs.readdirSync(dir)
    var idxOfNodeModules = dirFiles.indexOf('node_modules');
    dirFiles.splice(idxOfNodeModules, 1);

    dirFiles.forEach((file) => {
      zip.addLocalFile(file)
    })

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
      status.message('Deploying ' + clayConfig.serviceDisplayName + ' on Clay Cloud..');
      console.log(clayConfig);
      var requestOptions = {
        uri: this.apis.deployApi,
        method: 'POST',
        body: {
          serviceDescription: clayConfig.serviceDescription,
          serviceDisplayName: clayConfig.serviceDisplayName,
          serviceName:        `${clayConfig.username}-${clayConfig.serviceName}`,
          serviceInputs:      JSON.stringify(clayConfig.inputs),
          apiToken:           this.credentials.token,
          serviceType:        clayConfig.serviceType,
          packageHash:        packageHash,
          forceDeploy:        (deployConfig.options.force) ? true : false,
          serviceData:        zipBuffer.toString('base64')
        },
        timeout: 0,
        json: true
      }
      return rp(requestOptions)
    })
    .then((response) => {
      status.stop();
      var time = new Date();
      print(SERVICE_UPDATED_MSG, time.toLocaleDateString(), time.toLocaleTimeString())
      print(SERVICE_URL_MSG)
      resolve(response);
    })
    .catch((err) => {
      console.log(err);
      status.stop();
      if(process.env.CLAY_DEV) console.log(err);
      if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
      else if(deployConfig.mode == 'PUT') print(SERVICE_UPDATE_FAILED_MSG)
    })
  })
}



