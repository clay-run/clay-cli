const rp       = require('request-promise-native')
  ,   path     = require('path')
  ,   fs       = require('fs-extra')
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
  .then(function(answers) {
    var requestOptions = {
      uri: this.apis.loginApi,
      method: 'post',
      body: {
        email: answers.email,
        password: answers.password
      },
      timeout: 0,
      json: true
    }
    return rp(requestOptions)
  }.bind(this))
  .then((userCredentials) => {
    if(userCredentials.api_token) {
      //TODO: make this into one function with signup once these are all consolidated into one service class
      var credentials = {
        username: userCredentials.username,
        email: userCredentials.email,
        token: userCredentials.api_token
      }
      fs.writeFileSync(path.resolve(this.credentialsDir, 'clayCredentials.json'), JSON.stringify(credentials, null, 2));
      console.log("Wooo! You're now logged in")
    }
    // should never occur
    else console.log("Clay seems to have had a minor issue, please try logging in again.");
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err)
    if(err.statusCode == 401 || err.statusCode == 400) console.log("Looks like you entered a wrong email or password. Try again or signup with a new account.")
    else console.log("Clay seems to have had a minor issue, please try logging in again.");
  })
}


