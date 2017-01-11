var chalk    = require('chalk')
 ,  rp       = require('request-promise-native');


module.exports = function() {

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
    console.log(chalk.white("This is a list of all the services in your account\n"))
    response.forEach((service) => {
      console.log(chalk.white(`Name: `) + `${service.name.split('-').slice(1).join('-')}`)
      console.log(chalk.white(`Description: `)+ `${service.description}`)
      console.log(chalk.white(`Display Name: `)+`${service.method_display_name}\n`)
    })
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })

}


