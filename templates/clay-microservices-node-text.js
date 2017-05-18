var    chalk                = require('chalk')

module.exports = {
  serviceCreated: function(urlForService, dir, tutorialUrl) {
    return `
${chalk.green('Your Clay function has been deployed.\n')}
${chalk.white('✏️  Edit the file ') + chalk.bold(dir + '/index.js') + chalk.white(' and deploy using ' ) + chalk.green('clay deploy')}
${chalk.white('🚀  You can test your code locally using ') + chalk.green('clay test')}
${chalk.white('🎯  You can run your service by using the visual interface at ') + chalk.bold(urlForService) + chalk.white(' or by making an HTTP POST request from your code.')}
${chalk.white("That's all there is to it! For more information and help go to\n")+chalk.bold('http://www.github.com/clay-run/clay-cli')}`
  }
}
