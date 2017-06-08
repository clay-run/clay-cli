var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  rp       = require('request-promise-native');


module.exports = function(existingService, forkedService, account) {
  const     clayDir                      = path.resolve(__dirname, '..')
    ,       templateMessages             = require(path.resolve(clayDir, 'templates/clay-microservices-node-text.js'));

  var newService;
  // format serviceName also handles urls
  // var serviceName = existingService.split('/').slice(-2).join('-');
  if(!forkedService) {
    newService = existingService.split('/').slice(-1).join('-');
  } else {
    newService = forkedService;
  }

  const dir = path.resolve(process.cwd(), `${this.credentials.username}-${newService}`)

  if(fs.existsSync(dir)) {
    print(chalk.white(`Directory `)+chalk.red(`${dir}`)+chalk.white(` already exists please delete it to fork this Clay service`));
    process.exit();
  }

  print(chalk.white(`Starting fork of `)+chalk.red(`${existingService}`)+chalk.white(` (this may take a moment please wait):\n`));

  var forkOptions = {
    uri: this.apis.forkApi,
    method: 'POST',
    body: {
      apiToken: this.credentials.token,
      methodName: existingService,
      forkName: newService
    },
    timeout: 0,
    json: true
  }

  rp(forkOptions)
  .then(() => {
    print(chalk.white(`Finished forking the function...please wait while we download it\n`));
    return account.download(`${this.credentials.username}/${newService}`);
  })
  .then((dir) => {
    var urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
    print(templateMessages.serviceCreated(urlForService, dir, DOCS_LINK+'/tutorial'));
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    process.exit();
  })

}


