var    chalk                = require('chalk')

module.exports =  {
  serviceCreated: function(urlForService, dir, tutorialUrl) {
    return `
${chalk.white('YOUR ALEXA SKILL TEMPLATE CODE IS NOW LIVE AND DEPLOYED.\n')}
${chalk.white('CREATE & CONFIGURE ALEXA SKILL IN AMAZON (if you have not done this yet)')}
${chalk.white('******************************************\n')}
Go to:

https://developer.amazon.com/edw/home.html#/skill/create/

1. Select the Alexa Skills Kit and create a new skill.

2. Skill Information-Give the skill the following Invocation Name:

Awesome Bot

3. Interaction Model-Configure the intents in the Alexa skill with the following:

{
"intents": [
{
"intent": "GetAwesomeSaying"
},
{
"intent": "GetAwesomeNumber"
}
]
}

Add the following utterances:

GetAwesomeSaying to tell me something awesome
GetAwesomeSaying to give me an awesome saying
GetAwesomeNumber to give me an awesome number

4. Configuration-Select HTTPS in North America and paste the following URL:
${chalk.red(urlForService + '\n')}

5. SSL Cert-Select my development endpoint has a trusted certificate

${chalk.white('EDIT CODE AND REDPLOY')}
${chalk.white('******************************************\n')}
${chalk.white('The next step is to edit the code and make changes to the template here:') + '\n' + chalk.red(dir + '\n')}
${chalk.white('Then you can deploy it to production using:\n') +  chalk.red('clay deploy \n')}
${chalk.white('The best way to test it on production is to use the Alexa Test Skill Page (https://developer.amazon.com) or you can edit the test-data.json file and run the function using:')}
${chalk.red('clay run \n')}
${chalk.white('You can read these instruction and follow a tutorial here:')}
${chalk.red(tutorialUrl + '\n')}
${chalk.white('URL FOR ALEXA SKILL')}
${chalk.white('******************************************')}
${chalk.red(urlForService + '\n')}
${chalk.white("That's all there is to it! For more information and help go to:\n")+chalk.red('http://www.github.com/clay-run/clay-cli')}`
  }
}

