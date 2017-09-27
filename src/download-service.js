var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  zip      = require('adm-zip')
 ,  clui     = require('clui')
 ,  Spinner  = clui.Spinner
 ,  clayConfigGenerator = require('./clay-config-generator.js')
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

    if(!options.suppressMsg) {
        var status = new Spinner('Getting service info..');
        status.start();
    }

    var getFunctionOptions = {
      uri: this.apis.downloadApi,
      method: 'POST',
      body: {
        apiToken: this.credentials.token,
        serviceName: serviceName
      },
      timeout: 0,
      json: true
    }

    rp(getFunctionOptions)
      .then((response) => {
        if(status) {
            status.message('Downloading service..')
        }
        var downloadOptions = {
          uri: response.serviceUrl,
          method: 'GET',
          timeout: 0,
          encoding: null,
          json: true
        }
        return Promise.all([rp(downloadOptions), Promise.resolve(response.service)])
      })
      .then(([downloadedCode, service]) => {
        fs.writeFileSync(`${dir}.zip`, downloadedCode)
        var zipFolder = new zip(`${dir}.zip`)
        zipFolder.extractAllTo(`${dir}`)
        var clayConfig = clayConfigGenerator.defaultTemplate(service.name.split('-').slice(1).join('-'), service.type, service.function_input, service.description, service.name.split('-').shift())
        fs.writeFileSync(`${dir}/clay-config.json`, JSON.stringify(clayConfig, null, 2))
        if(!options.suppressMsg) print((`✅ Successfully downloaded the Clay service to this directory `)+chalk.green(`${dir}`));
        if(status) { status.stop() }
        fs.removeSync(`${dir}.zip`)
        resolve(dir);
      })
      .catch((err) => {
        if(status) { status.stop() }
        if(err.statusCode == 401) {
          print(chalk.white(`\nUnauthorized or not found: \n\n1. Make sure you entered the name of the service or the url to the service. \nE.g. `)+chalk.red(`clay download nicoslepicos/whois`)+chalk.white(` or `)+chalk.red(`clay download http://clay.run/services/nicoslepicos/whois`))
          print(chalk.white(`\n2. Also, make sure that this service exists and is owned by you or it is a public service`))
          process.exit();
        }
        else if(err.statusCode == 500) {
          print(chalk.white(`Error has occurred please contact support@clay.run`));
          process.exit();
        }
        if(process.env.CLAY_DEV) console.log(err);
        process.exit();
      })
  })


}


