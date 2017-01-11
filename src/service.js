var   chalk         = require('chalk')
 ,    deployService = require('./deploy-service.js')
 ,    newService    = require('./new-service.js')
 ,    logService    = require('./new-service.js')
 ,    runService    = require('./new-service.js')
 ,    infoService   = require('./new-service.js')
 ,    print         = console.log;

function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  //apis needs to be the whole object
  this.api = serviceConfig.api;
  this.servicePage = serviceConfig.servicePage;
  this.dir =serviceConfig.dir;
  this.clayConfig = serviceConfig.clayConfig
}

Service.prototype.create = newService;
Service.prototype.deploy = deployService;
Service.prototype.logs   = logService;
Service.prototype.info   = infoService;
Service.prototype.run    = runService;


module.exports = Service;
