var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  zip      = require('adm-zip')
 ,  rp       = require('request-promise-native');


module.exports = function(serviceName, options) {
  return new Promise((resolve, reject) => {
    // format serviceName
    options = options || {suppressMsg: false};

    serviceName = serviceName.split('/').slice(-2).join('-');

    const dir = path.resolve(process.cwd(), `${serviceName}`)

    if(fs.existsSync(dir)) {
      print(chalk.white(`Directory `)+chalk.red(`${dir}`)+chalk.white(` already exists please delete it to download this Clay service`));
      process.exit();
    }

    if(!options.suppressMsg) print(chalk.white(`Starting download of Clay service:\n`));

    var getFunctionOptions = {
      uri: this.apis.downloadApi,
      method: 'POST',
      body: {
        apiToken: this.credentials.token,
        functionName: serviceName
      },
      timeout: 0,
      json: true
    }

    rp(getFunctionOptions)
      .then((response) => {
        if(response.statusCode == 401) {
          print(chalk.white(`Make sure you entered the name of the service or the url to the service. E.g. `)+chalk.red(`clay download nicoslepicos/whois`)+chalk.white(` or `)+chalk.red(`clay download http://clay.run/services/nicoslepicos/whois`))
          print(chalk.white(`Also, make sure that this service exists and is owned by you or it is a public service`))
          process.exit();
        }
        else if(response.statusCode == 500) {
          print(chalk.white(`Error has occurred please contact support@clay.run`));
          process.exit();
        }
        var downloadOptions = {
          uri: response.service.Code.Location,
          method: 'GET',
          timeout: 0,
          encoding: null,
          json: true
        }
        return rp(downloadOptions)
      })
      .then((downloadedCode) => {
        fs.writeFileSync(`${dir}.zip`, downloadedCode)
        var zipFolder = new zip(`${dir}.zip`)
        zipFolder.extractAllTo(`${dir}`)
        if(!options.suppressMsg) print(chalk.white(`Successfully downloaded the Clay service to this directory `)+chalk.red(`${dir}`));
        fs.removeSync(`${dir}.zip`)
        resolve(dir);
      })
      .catch((err) => {
        if(process.env.CLAY_DEV) console.log(err);
        process.exit();
      })
  })


}


