var   deployService = require('./deploy-service.js')
 ,    newService    = require('./new-service.js')
 ,    logService    = require('./get-service-logs.js')
 ,    runService    = require('./run-service.js')
 ,    infoService   = require('./get-service-info.js');

function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  this.apis        = serviceConfig.apis;
  this.servicePage = serviceConfig.servicePage;
  this.clayConfig  = serviceConfig.clayConfig
}

Service.prototype.create = newService;
Service.prototype.deploy = deployService;
Service.prototype.logs   = logService;
Service.prototype.info   = infoService;
Service.prototype.run    = runService;

module.exports = Service;
