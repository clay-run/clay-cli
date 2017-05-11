const  chalk         = require('chalk');

module.exports = function() {
  console.log(chalk.white(`You are currently signed in as: `)+chalk.red(`${this.credentials.username}\n`));
}



