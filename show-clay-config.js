const  getClayConfig     = require('./get-clay-config.js');

module.exports = function() {
  var clayConfig = getClayConfig();
  // Pretty print the config here
  if(clayConfig) printClayConfig(clayConfig);
}

function printClayConfig(clayConfig) {
  console.log("Information about your service:\n");
  console.log("You can change this configuration by altering clayConfig.json\n");
  console.log(JSON.stringify(clayConfig, null, 4));
}


