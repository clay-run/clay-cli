const  chalk         = require('chalk');

module.exports = function() {
  // Pretty print the config here
  if(this.clayConfig)
  {
    console.log(chalk.white("Information about your service:\n"));
    console.log("You can change this configuration by altering clayConfig.json\n");
    console.log(JSON.stringify(this.clayConfig, null, 4));
  }
}



