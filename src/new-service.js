var   path                 = require('path')
  ,   chalk                = require('chalk')
  ,   print                = console.log
  ,   exec                 = require('child-process-promise').exec
  ,   fs                   = require('fs-extra-promise')
  ,   inquirer             = require('inquirer')
  ,   rp                   = require('request-promise-native')
  ,   clayDir              = path.resolve(__dirname, '..')
  ,   templateMessages     = require(path.resolve(clayDir, 'templates/clay-microservices-node-text.js'))
  ,   clui                 = require('clui');


module.exports = function(serviceName, account) {
  const INVALID_SERVICE_NAME_ERR_MSG = chalk.red("You must enter a valid name for the service. Only use lower case letters, numbers, dashes or an underscore.")
    ,   NO_SERVICE_NAME_ERR_MSG      = chalk.white("You need a name for your service. Use:\n\n")+chalk.red("clay new <serviceName>\n")+chalk.white("\nReplace serviceName with the name of your service and do not include the angle brackets.")
    ,   DOCS_LINK                    = 'https://www.clay.run/docs'
    ,   SERVICE_NOT_CREATED          = chalk.white("Service was not created. Contact support@tryclay.com") + chalk.white(`\nCleaning up any files or directories that were created`)

  var getServiceName;

  if(serviceName) {
    getServiceName = Promise.resolve({serviceName: serviceName});
  } else {
    getServiceName = inquirer.prompt([{
      name: 'serviceName',
      message: 'What is the name of the service?',
      validate: function(value) {
        if(value.length) {
          if(!/^[-0-9_a-z~]+$/.test(value)) {
            return INVALID_SERVICE_NAME_ERR_MSG;
          }
          return true;
        } else {
          return 'The name of your service cannot be empty.';
        }
      }
    }, {
      name: 'serviceType',
      type: 'list',
      choices: [
        'microservice (default)',
        'alexa'
      ],
      message: 'Which template do you want to use (press enter for default)'
    }])
  }

  getServiceName
  .then((answers) => {
      const   serviceName                  = answers.serviceName
      ,       serviceType                  = answers.serviceType
      ,       dir                          = path.resolve(process.cwd(), `${serviceName}`)
      ,       SERVICE_EXISTS_ERR_MSG       = chalk.white(`Couldn't create service: `)+chalk.red(`${serviceName}\n`)+chalk.white(`Service already exists in your account`)
      ,       DIR_EXISTS_ERR_MSG           = chalk.white(`Looks like a directory already exists with the name of your service. Please delete this directory:`) +chalk.red(`\n\n${dir}`)+chalk.white(` \n\nand try again.`);

    // Error checking must have a valid name and no directory with that name in folder
    if(!serviceName) {
      print(NO_SERVICE_NAME_ERR_MSG)
      return
    }

    if(!/^[-0-9_a-z~]+$/.test(serviceName)) {
      print(INVALID_SERVICE_NAME_ERR_MSG)
      return
    }

  var getFunctionOptions = {
    uri: this.apis.createApi,
    method: 'POST',
    body: {
      apiToken: this.credentials.token,
      serviceName: serviceName,
      serviceType: serviceType
    },
    timeout: 0,
    json: true
  }

    // Copy files that come with the package as the template
    Spinner = clui.Spinner;
    var status = new Spinner('Creating service ...');
    status.start();

    rp(getFunctionOptions)
    .then((deployResponse) => {
      status.stop();
      return account.download(`${this.credentials.username}/${serviceName}`, {suppressMsg: true})
    })
    .then((dir) => {
      var urlForService = `${this.apis.servicePage}/${this.credentials.username}/${serviceName}`
      print(templateMessages.serviceCreated(urlForService, dir, DOCS_LINK+'/tutorial'));
    })
    .catch((err) => {
      status.stop();
      if(process.env.CLAY_DEV) console.log(err);
      if(err && !err.statusCode) print(SERVICE_NOT_CREATED)
      else if(err.statusCode == 409) print(SERVICE_EXISTS_ERR_MSG)
      else if(err.statusCode == 500) print(SERVICE_NOT_CREATED)
      fs.removeSync(dir);
    })
  })
}
