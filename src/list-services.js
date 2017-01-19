var chalk    = require('chalk')
 ,  print    = console.log
 ,  rp       = require('request-promise-native');


module.exports = function() {

  const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)
  var options = {
    uri: this.apis.methodsApi,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(options)
  .then((response) => {
    print(chalk.white("This is a list of all the services in your account\n"))
    response.forEach((service) => {
      print(chalk.white(`Name: `) + `${service.name.split('-').slice(1).join('-')}`)
      print(chalk.white(`Description: `)+ `${service.description}`)
      print(chalk.white(`Display Name: `)+`${service.method_display_name}\n`)
    })
  })
  .catch((err) => {
    if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
    process.exit();
  })

}


