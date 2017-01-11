const path     = require('path')
  ,   fs       = require('fs');

module.exports = function(clayServiceDir) {
  var clayConfig = null;
  // Check if it's in the service directory that was passed or the current working directory
  clayServiceDir = clayServiceDir || process.cwd();
  var clayConfigFileName = 'clay-config.json'
  var clayConfigServiceDir = path.resolve(clayServiceDir,  clayConfigFileName);
  if(fs.existsSync(clayConfigServiceDir)) clayConfig = require(clayConfigServiceDir)
  return clayConfig
}


