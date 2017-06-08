const path     = require('path')
  ,   print    = console.log
  ,   chalk    = require('chalk')
  ,   fs       = require('fs-extra');

module.exports = function(clayServiceDir) {
  var clayConfig = null;
  // Check if it's in the service directory that was passed or the current working directory
  clayServiceDir = clayServiceDir || process.cwd();
  var clayConfigFileName = 'clay-config.json'
  var clayConfigServiceDir = path.resolve(clayServiceDir,  clayConfigFileName);
  if(fs.existsSync(clayConfigServiceDir)) { 
      try {
        clayConfig = require(clayConfigServiceDir)
      } catch(e) {
        print(chalk.red('Could not parse clay-config.json file'));
        process.exit(0);
      }
  }
  return clayConfig
}


