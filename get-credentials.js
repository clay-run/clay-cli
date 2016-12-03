const path     = require('path')
  ,   fs       = require('fs');

module.exports = function(clayCredentialsDir) {
  if(!fs.existsSync(clayCredentialsDir)) fs.mkdirSync(clayCredentialsDir)
  if(fs.existsSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'))) return require(path.resolve(clayCredentialsDir, 'clayCredentials.json'))
  else {
    console.log("You must sign up or login to use Clay. Type clay signup or clay login respectively.")
    process.exit()
  }
}


