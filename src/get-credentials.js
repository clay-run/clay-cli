const path     = require('path')
  ,   fs       = require('fs-extra');

module.exports = function(clayCredentialsDir) {
  var clayCredentials = null;
  if(fs.existsSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'))) clayCredentials = require(path.resolve(clayCredentialsDir, 'clayCredentials.json'))
  return clayCredentials
}


