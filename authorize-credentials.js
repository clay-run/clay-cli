const rp       = require('request-promise-native')
  ,   path     = require('path')
  ,   fs       = require('fs')
  ,   inquirer = require('inquirer');

module.exports = function(authorizeApi, clayCredentialsDir) {
  var email = {
    type: 'input',
    name: 'email',
    message: 'Enter your email address',
    validate: function(email) {
      if(email === '') return 'please enter an email'
        else return true
    }
  };
  var password = {
    type: 'password',
    name: 'password',
    message: 'Enter a password',
    validate: function(password) {
      if(password === '') return 'please enter a password'
        else return true
    }
  };

  inquirer.prompt([email, password])
  .then(function (answers) {
    var requestOptions = {
      uri: authorizeApi,
      method: 'post',
      body: {
        email: answers.email,
        password: answers.password
      },
      timeout: 0,
      json: true
    }
    return rp(requestOptions)
  })
  .then((signupResult) => {
    if(signupResult.api_token) {
      fs.writeFileSync(path.resolve(clayCredentialsDir, 'clayCredentials.json'), JSON.stringify({token: signupResult.api_token}, null, 2));
      console.log("Wooo! You're now logged in")
    }
    // should never occur
    else console.log("Unfortunately Clay hit a brick wall. Contact support@tryclay.com");
  })
  .catch((err) => {
    if(err.statusCode == 401) console.log("Something went wonky, you entered a wrong email or password. Try again or signup with a new account.")
    else console.log("Unfortunately Clay hit a brick wall. Contact support@tryclay.com");
  })
}


