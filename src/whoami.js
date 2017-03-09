const  chalk         = require('chalk');

module.exports = function() {
  // Pretty print the config here
  console.log(chalk.white(`You are currently signed in as: `)+chalk.red(`${this.credentials.username}\n`));
}



