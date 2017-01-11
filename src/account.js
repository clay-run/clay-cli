var createAccount = require('./create-account.js')
 ,  loginAccount  = require('./login-account.js');

function Account(config) {
  this.apis = config.apis;
  this.credentialsDir = config.credentialsDir;
}

Account.prototype.signup = createAccount;
Account.prototype.login  = loginAccount;

module.exports = Account;
