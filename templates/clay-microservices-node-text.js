var    chalk                = require('chalk')

module.exports = {
  serviceCreated: function(urlForService, dir, tutorialUrl) {
    return `
${chalk.white('YOUR NODE SERVICE IS NOW LIVE AND DEPLOYED.\n')}
${chalk.white('EDIT CODE AND CONFIGURE SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('The next step is to edit the code and configuration for your service which is here:') + '\n' + chalk.red(dir + '\n')}
${chalk.white('After you make changes test it locally using:\n') +  chalk.red('clay test \n')}
${chalk.white('DEPLOY YOUR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.white('Then you can deploy it to production using:\n') +  chalk.red('clay deploy \n')}
${chalk.white('RUN YOUR SERVICE (ONLY RESPONDS TO POST REQUESTS):')}
${chalk.white('******************************************\n')}
${chalk.white('You can run your service by using the visual interface at this url or by making an HTTP POST request from your code:')}
${chalk.red(urlForService + '\n')}
${chalk.white('You can also run it on production using:\n') +  chalk.red('clay run \n')}
${chalk.white('URL FOR SERVICE')}
${chalk.white('******************************************\n')}
${chalk.red(urlForService + '\n')}
${chalk.white("That's all there is to it! For more information and help go to\n")+chalk.red('http://www.github.com/clay-run/clay-cli')}`
  }
}
