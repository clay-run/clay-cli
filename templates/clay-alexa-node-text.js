var    chalk                = require('chalk')

module.exports =  {
  serviceCreated: `
${chalk.white('Your Alexa Skill Template code is now live and deployed.\n')}
${chalk.white('URL FOR ALEXA SKILL')}
${chalk.white('******************************************\n')}
${chalk.red('%s\n')}
${chalk.white('CREATE & CONFIGURE ALEXA SKILL IN AMAZON (if you have not done this yet)')}
${chalk.white('******************************************\n')}
Go to:

https://developer.amazon.com/

1. Select the Alexa Section and create a new skill.

2. Give the skill the following Invocation Name:

Awesome Bot

3.Configure the intents in the Alexa skill with the following:

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

4. Select HTTPS in North America and past the following URL:


5. Select already have certificate

${chalk.white('EDIT CODE AND REDPLOY')}
${chalk.white('******************************************\n')}
${chalk.white('The next step is to edit the code and make changes to the template here:') + '\n' + chalk.red('%s\n')}
${chalk.white('The best way to test it on production is to use the Alexa Test Skill Page or you can edit the test-date.json file and run it using:')}
${chalk.red('clay run \n')}
${chalk.white('Then you can deploy it to production using:\n') +  chalk.red('clay deploy \n')}
${chalk.white('You can read these instruction and follow a tutorial here:')}
${chalk.white("That's all there is to it! For more information and help go to")+chalk.red(' http://www.github.com/clay-run/clay-cli')}`
}

