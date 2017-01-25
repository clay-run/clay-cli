var open = require('open');


module.exports = function(serviceName) {
  var urlForService;

  if(serviceName != null) {
    urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
    open(urlForService)
  } else if (this.clayConfig != null && this.clayConfig.serviceName != null) {
    urlForService = `${this.apis.servicePage}/${this.credentials.username}/${this.clayConfig.serviceName}`
    open(urlForService)
  } else {
    console.log("Please enter a name of a service to open or run it from within a Clay service directory")
  }
}
