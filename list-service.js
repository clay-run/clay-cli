var chalk    = require('chalk')
 ,  rp       = require('request-promise-native');

function Lister (config) {
  this.credentials = config.credentials;
  this.api = config.api;
}

Lister.prototype.list = function() {

  var options = {
    uri: this.api,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(options)
  .then((response) => {
    console.log(chalk.white("This is a list of all the services in your account"))
    response.forEach((service) => {
      console.log("\n")
      console.log(chalk.white(`Name: `) + `${service.name}`)
      console.log(chalk.white(`Description: `)+ `${service.description}`)
      console.log(chalk.white(`Display Name: `)+`${service.method_display_name}`)
      console.log("\n")
    })
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })

}
module.exports =  Lister;


