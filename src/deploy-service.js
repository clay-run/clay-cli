var path                      = require('path')
 ,  exec                      = require('child_process').exec
 ,  chalk                     = require('chalk')
 ,  rp                        = require('request-promise-native')
 ,  print                     = console.log
 ,  archiver                  = require('archiver')
 ,  UPDATING_SERVICE_MSG      = chalk.white(`Updating Service...\n`)
 ,  SERVICE_UPDATED_MSG       = chalk.green(`✅ Service Updated.`)
 ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`)
 ,  clui                      = require('clui')
 ,  Spinner                   = clui.Spinner;

module.exports = function(deployConfig) {
  return new Promise((resolve, reject) =>  {

    const dir                     = deployConfig.dir
    const currentProjectConfig    = require(path.resolve(dir,  'clay-config.json'));
    const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)
    const SERVICE_URL_MSG         = chalk.white(`🚀 Your service is available here: `)+chalk.green.underline(`${this.apis.servicePage}/${this.credentials.username}/${currentProjectConfig.serviceName}`)

    var execOptions = {
      maxBuffer: 1024 * 50000,
      cwd: dir
    };

    var status = new Spinner('Building your service..');
    status.start();
    var archive = archiver('zip');

    // Adding the function directory
    archive.directory(deployConfig.dir || '.', false, { date: new Date() });

    // On zipping error
    archive.on('error', function(err) {
      if (err) {
        print(SERVICE_UPDATE_FAILED_MSG)
        return
      }
    });

    // Saving buffers to RAM
    var zip_buffers = [];
    archive.on('data', function(buffer) {
        zip_buffers.push(buffer);
    });

    archive.on('end', function() {
      var zip_buffer = Buffer.concat(zip_buffers);

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
          fileData: zip_buffer.toString('base64')
        },
        timeout: 0,
        json: true
      }

      status.message('Deploying ' + currentProjectConfig.serviceDisplayName + ' on Clay Cloud..');
      rp(requestOptions)
      .then((response) => {
        status.stop();
        var bytes = archive.pointer();
        var mbs = Math.floor(((bytes / 1024) / 1024) * 100) / 100;
        console.log(('Your service weights ' + archive.pointer() + ' bytes (' + mbs + ' MBs).'));
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
        reject(err);
      })
    }.bind(this))

    archive.finalize();
  })

}



