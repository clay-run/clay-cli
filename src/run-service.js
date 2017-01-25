var path  = require('path')
 ,  rp    = require('request-promise-native')
 ,  chalk = require('chalk');

module.exports = function(serviceName) {

  // either test-data.json or you pass parameters to it
  var urlForService;
  var data;

  if(serviceName != null) {
    urlForService = `${this.apis.servicePage}/${serviceName}`
    data = {
      varNameInCode: 'test'
    };
  } else if (this.clayConfig != null && this.clayConfig.serviceName != null) {
    urlForService = `${this.apis.servicePage}/${this.credentials.username}/${this.clayConfig.serviceName}`
    data  = require(path.resolve(process.cwd(), 'test-data.json'))
  } else {
    console.log("Please enter a name of a service to run or execute this command from within a Clay service directory")
    return;
  }

  var options = {
    uri: urlForService,
    method: 'POST',
    body: data,
    timeout: 0,
    json: true
  }

  console.log(chalk.white(`Making an HTTP POST request to:`)+chalk.red(`\n${options.uri}\n`))
  console.log(chalk.white(`With the following passed in the body:\n`)+chalk.red(`${JSON.stringify(data, null, 2)}\n`))
  rp(options)
  .then((response) => {
    console.log(chalk.white(`Response:\n`)+chalk.red(`${JSON.stringify(response, null, 2)}`));
  })
  .catch((err) => {
    if(err.statusCode == 401) console.log(chalk.white(`Not authorized to access: `)+chalk.red(`${this.clayConfig.serviceName}\n`))
    else if(err.statusCode == 500) console.log("Service was not created. Contact support@tryclay.com")
  })
}
