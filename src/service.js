var   deployService = require('./deploy-service.js')
 ,    newService    = require('./new-service.js')
 ,    logService    = require('./get-service-logs.js')
 ,    testService   = require('./test-service.js')
 ,    runService    = require('./run-service.js')
 ,    openService   = require('./open-service.js')
 ,    forkService   = require('./fork-service.js')
 ,    deployProject = require('./deploy-project.js')
 ,    dp            = require('./dp.js')
 ,    manageEnvService = require('./manage-env-service.js')
 ,    lintConfig    = require('./lint-config.js')
 ,    infoService   = require('./get-service-info.js');

function Service(serviceConfig) {
  this.credentials = serviceConfig.credentials;
  this.apis        = serviceConfig.apis;
  this.servicePage = serviceConfig.servicePage;
  this.clayConfig  = serviceConfig.clayConfig
  if(this.clayConfig && this.credentials) {
    this.urlForService = `${this.apis.servicePage}/${this.credentials.username}/${this.clayConfig.serviceName}`
  }
}

Service.prototype.create = newService;
Service.prototype.deploy = deployService;
Service.prototype.dp     = dp;
Service.prototype.logs   = logService;
Service.prototype.info   = infoService;
Service.prototype.test   = testService;
Service.prototype.run    = runService;
Service.prototype.fork   = forkService;
Service.prototype.open   = openService;
Service.prototype.manageEnv = manageEnvService;
Service.prototype.deployProject = deployProject;
Service.prototype.lintConfig = lintConfig;

module.exports = Service;
