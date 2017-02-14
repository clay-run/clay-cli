var rp     = require('request-promise-native')
 ,  chalk  = require('chalk');

module.exports = function() {

  var options = {
    uri: `${this.apis.logsApi}/${this.credentials.username}-${this.clayConfig.serviceName}`,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(options)
  .then((response) => {
    var messages = response.map((logs) => logs.message);
    var stringMessages = messages.reverse().join('\n')
    console.log(stringMessages);
  })
  .catch((err) => {
    console.log(err);
    if(err.statusCode == 401) console.log(chalk.white(`Not authorized to access: `)+chalk.red(`${this.clayConfig.serviceName}\n`))
    else if(err.statusCode == 500) console.log("Service was not created. Contact support@tryclay.com")
  })
}
