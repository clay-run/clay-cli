var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  decompress  = require('decompress')
 ,  rp       = require('request-promise-native');


module.exports = function(existingService, forkedService) {

  var newService;
  // format serviceName also handles urls
  var serviceName = existingService.split('/').slice(-2).join('-');
  if(!forkedService) {
    newService = existingService.split('/').slice(-1).join('-');
  } else {
    newService = forkedService;
  }

  const dir = path.resolve(process.cwd(), `${this.credentials.username}-${newService}`)

  if(fs.existsSync(dir)) {
    print(chalk.white(`Directory `)+chalk.red(`${dir}`)+chalk.white(` already exists please delete it to download this Clay service`));
    process.exit();
  }

  print(chalk.white(`Starting fork of `)+chalk.red(`${existingService}`)+chalk.white(` (this may take a moment please wait):\n`));

  var getFunctionOptions = {
    uri: this.apis.methodsApi+`/${serviceName}/fork`,
    method: 'POST',
    body: {
      apiToken: this.credentials.token,
      forkName: newService
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
      uri: response.downloadUrl,
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
  .then(() => {
    fs.removeSync(`${dir}.zip`)
    if(!fs.existsSync(`${dir}/index.js`)) fs.renameSync(`${dir}/${serviceName.split('-').slice(1).join('-')}.js`, `${dir}/index.js`)
    var clayConfig = require(`${dir}/clay-config.json`);
    clayConfig.serviceName = newService;
    var clayConfigJson = JSON.stringify(clayConfig, null, 2)
    fs.writeFileSync(`${dir}/clay-config.json`, clayConfigJson);
    return this.deploy({mode: 'PUT', dir: dir, suppressProgressMessages: true});
  })
  .then(() => {
    print(chalk.white(`Successfully downloaded the Clay service to this directory `)+chalk.red(`${dir}`));
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    print(chalk.white(err.error.error));
    process.exit();
  })

}


