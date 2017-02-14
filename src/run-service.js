var path  = require('path')
 ,  rp    = require('request-promise-native')
 ,  chalk = require('chalk');

module.exports = function(serviceName, jsonData) {

  // either test-data.json or you pass parameters to it
  var urlForService;
  var data;
  var dataMsg;

  if(serviceName != null) {
    urlForService = `${this.apis.servicePage}/${serviceName}`;
    data = (jsonData) ? JSON.parse(jsonData) : null;
    dataMsg = chalk.white(`Passing the following JSON data as the BODY:\n`)+chalk.red(`${JSON.stringify(data, null, 2)}\n`);
  } else if (this.clayConfig != null && this.clayConfig.serviceName != null) {
    urlForService = `${this.apis.servicePage}/${this.credentials.username}/${this.clayConfig.serviceName}`
    data  = require(path.resolve(process.cwd(), 'test-data.json'))
    dataMsg = chalk.white(`Using JSON data from test-data.json as the BODY:\n`)+chalk.red(`${JSON.stringify(data, null, 2)}\n`);
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
  console.log(dataMsg);
  rp(options)
  .then((response) => {
    // Currently assumes only a JSON response
    console.log(chalk.white(`Response:\n`)+chalk.red(`${JSON.stringify(response, null, 2)}`));
  })
  .catch((err) => {
    if(err.statusCode == 401) console.log(chalk.white(`Not authorized to access: `)+chalk.red(`${this.clayConfig.serviceName}\n`))
    else console.log("An error occurred please contact support@clay.run")
  })
}
