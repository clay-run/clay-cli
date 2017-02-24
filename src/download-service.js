var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  decompress  = require('decompress')
 ,  rp       = require('request-promise-native');


module.exports = function(serviceName) {

  // format serviceName
  serviceName = serviceName.split('/').slice(-2).join('-');

  const dir = path.resolve(process.cwd(), `${serviceName}`)

  if(fs.existsSync(dir)) {
    print(chalk.white(`Directory `)+chalk.red(`${dir}`)+chalk.white(` already exists please delete it to download this Clay service`));
    process.exit();
  }

  print(chalk.white(`Starting download of Clay service:\n`));

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
    return decompress(`${dir}.zip`, `${dir}`)
  })
  .then((result) => {
    fs.removeSync(`${dir}.zip`)
    var clayConfig = require(`${dir}/clay-config.json`);
    clayConfig.serviceName = serviceName.split('-').slice(1).join('-');
    var clayConfigJson = JSON.stringify(clayConfig, null, 2)
    fs.writeFileSync(`${dir}/clay-config.json`, clayConfigJson);
    print(chalk.white(`Successfully downloaded the Clay service to this directory `)+chalk.red(`${dir}`));
  })
  .catch((err) => {
    process.exit();
  })

}


