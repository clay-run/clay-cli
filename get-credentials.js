const path     = require('path')
  ,   fs       = require('fs');

module.exports = function(clayCredentialsDir) {
  var clayCredentials = null;
  if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)
  if(fs.existsSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'))) clayCredentials = require(path.resolve(clayCredentialsDir, 'clayCredentials.json'))
  return clayCredentials
}


