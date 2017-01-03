var path = require('path');

function Runner(serviceConfig) {
  this.clayConfig = serviceConfig.clayConfig
}

Runner.prototype.run = function() {

var service = require(path.resolve(process.cwd(), `${this.clayConfig.commandName}.js`)).handler;
var data = require(path.resolve(process.cwd(), 'test-data.json'))

var event = {}
var context = {
  functionName: this.clayConfig.commandName,
  functionDescription: this.clayConfig.commandDescription,
  functionVersion: 0.1,
  succeed: (response => console.log(response.body))
}

event.body = JSON.stringify(data);
service(event, context)

}

module.exports = Runner;


