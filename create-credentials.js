const rp       = require('request-promise-native')
  ,   path     = require('path')
  ,   fs       = require('fs')
  ,   chalk   = require('chalk')
  ,   inquirer = require('inquirer');

module.exports = function(signupApi, clayCredentialsDir) {
  if(!fs.existsSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'))){
    var email = {
      type: 'input',
      name: 'email',
      message: 'Enter your email address',
      valid: function(email) {
        if(email === '') 'please enter an email'
          else return true
      }
    };
    var password = {
      type: 'password',
      name: 'password',
      message: 'Enter a password',
      valid: function(password) {
        if(password === '') 'please enter a password'
          else return true
      }
    };
    var username = {
      type: 'input',
      name: 'username',
      message: 'Enter a username',
      valid: function(username) {
        if(username === '') 'please enter a username'
          else return true
      }
    }
    // make a call to get a unique token that gets saved and used in future calls

    inquirer.prompt([email, password, username])
    .then(function (answers) {
      var requestOptions = {
        uri: signupApi,
        method: 'post',
        body: {
          email: answers.email,
          password: answers.password,
          username: answers.username
        },
        timeout: 0,
        json: true
      }
      return rp(requestOptions)
    })
    .then((signupResult) => {
      fs.writeFileSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'), JSON.stringify(signupResult, null, 2));
      console.log(chalk.white("Wooo! You're now signed up. Try creating a new service using clay new"))
    })
    .catch((err) => {
      console.log("Clay hit an error creating your login credentials");
    })
  }
}


