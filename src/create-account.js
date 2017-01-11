const rp       = require('request-promise-native')
  ,   path     = require('path')
  ,   fs       = require('fs')
  ,   chalk    = require('chalk')
  ,   inquirer = require('inquirer');

module.exports = function() {
  var email = {
    type: 'input',
    name: 'email',
    message: 'Enter your email address',
    validate: function(email) {
      if(email === '') return 'Please enter an email'
        else if(email.match(/.*@.+/) == null) return 'Please enter a valid email'
        else return true
      return true;
    }
  };
  var password = {
    type: 'password',
    name: 'password',
    message: 'Enter a password',
    validate: function(password) {
      if(password === '') return 'Please enter a password'
        else return true
    }
  };
  var confirmPassword = {
    type: 'password',
    name: 'confirmPassword',
    message: 'Confirm password',
    validate: function(confirmPassword) {
      if(password === '') return 'Please confirm password'
        else return true
    }
  };
  var username = {
    type: 'input',
    name: 'username',
    message: 'Enter a username',
    validate: function(username) {
      if(username === '') return 'Please enter a username'
        else if(username.match(/[^a-zA-Z0-9_]/)) return 'Please only use letters, numbers or _ in your username'
        else return true
      return true
    }
  }
  // make a call to get a unique token that gets saved and used in future calls

  inquirer.prompt([email, password, confirmPassword, username])
  .then((answers) => {
    if(answers.password !== answers.confirmPassword) {
      console.log(chalk.white("The passwords you entered don't match. Please try signing up again."))
      process.exit();
    }

    var requestOptions = {
      uri: this.apis.signupApi,
      method: 'POST',
      body: {
        email: answers.email.toLowerCase(),
        password: answers.password,
        username: answers.username.toLowerCase()
      },
      timeout: 0,
      json: true
    }
    return rp(requestOptions)
  })
  .then((signupResult) => {
    if(signupResult) {
      fs.writeFileSync(path.resolve(this.credentialsDir, 'clayCredentials.json'), JSON.stringify(signupResult, null, 2));
      console.log(chalk.white("Wooo! You're now signed up. Try creating a new service using clay new"))
    }
    else console.log("Unfortunately Clay hit a brick wall. Contact support@tryclay.com");
  })
  .catch((err) => {
    if(err.statusCode == 400) console.log("You must enter a value for email, password and username");
    else console.log("The username or email address is already taken. Try logging in or using a different email address or username");
  })
}


