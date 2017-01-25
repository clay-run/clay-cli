var    chalk                = require('chalk')

module.exports = {
  serviceCreated:`
${chalk.white('Your node service is now live and deployed.\n')}
${chalk.white('URL FOR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.red('%s\n')}
${chalk.white('EDIT CODE AND CONFIGURE SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('The next step is to edit the code and configuration for your service which is here:') + '\n' + chalk.red('%s\n')}
${chalk.white('After you make changes test it locally using:\n') +  chalk.red('clay test \n')}
${chalk.white('DEPLOY YOUR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('Then you can deploy it to production using:\n') +  chalk.red('clay deploy \n')}
${chalk.white('RUN YOUR SERVICE (ONLY RESPONDS TO POST REQUESTS):')}
${chalk.white('******************************************\n')}
${chalk.white('You can run your service by using the visual interface or by making an HTTP POST request to following url from your code:')}
${chalk.red('%s\n')}
${chalk.white('You can also run it on production using:\n') +  chalk.red('clay run \n')}
${chalk.white("That's all there is to it! For more information and help go to")+chalk.red(' http://www.github.com/clay-run/clay-cli')}`
}
