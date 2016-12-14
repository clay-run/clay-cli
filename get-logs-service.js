var rp       = require('request-promise-native');

function Logger (logConfig) {
  this.credentials = logConfig.credentials;
  this.api = logConfig.api;
  this.clayConfig = logConfig.clayConfig;
}

Logger.prototype.log = function() {

  var options = {
    uri: this.api,
    method: 'GET',
    qs: {
      name: this.clayConfig.commandName,
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(options)
  .then((response) => {
    var messages = response.map((logs) => logs.message);
    var stringMessages = messages.join('\n')
    console.log(stringMessages);
  })
  .catch((err) => {
    console.log(err);
    console.log("Unfortunately Clay hit a brick wall. Contact support@tryclay.com");
  })
}

module.exports =  Logger;



