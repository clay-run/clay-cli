var chalk               = require('chalk')
  , print               = console.log
  , path                = require('path')
  , getClayConfig       = require('./get-clay-config.js')
  , _                   = require('underscore');

module.exports = function(configDir, log) {
    return new Promise((resolve, reject) => {
        const config     = getClayConfig(configDir);
        var   errors     = []
            , validTypes = ['db', 'text', 'url', 'date', 'address', 'select', 'image', 'file', 'json', 'autocomplete'];

        if(!config.serviceName || config.serviceName.length < 3) {
            errors.push({
                message: 'Please provide a ' + chalk.underline('`serviceName`.')
            })
        }

        if(!config.serviceDisplayName || config.serviceDisplayName.length < 3) {
            errors.push({
                message: 'Please provide a ' + chalk.underline('`serviceDisplayName`.')
            })
        }

        if(!config.serviceDescription || config.serviceDescription.length < 3) {
            errors.push({
                message: 'Please provide a ' + chalk.underline('`serviceDescription`.')
            })
        }

        if(config.inputs) {
            var index = 0;
            var namesTaken = {};

            _.each(config.inputs, function(input) {
                index++;

                if(!input.name || input.name.length < 2) {
                    errors.push({
                        message: 'Input #'+index+' needs a name (at least 1 character).'
                    });
                }

                var name = input.name;
                if(namesTaken[name]) {
                    errors.push({
                        message: 'Duplicate name '+chalk.green(name)+' for input #'+index
                    })
                }
                namesTaken[name] = true;

                if(!input.type) {
                    errors.push({
                        message: 'Input '+chalk.green(name)+' does not have a valid type.'
                    })
                } else if(!_.contains(validTypes, input.type)) {
                    errors.push({
                        message: 'Type ' + chalk.green(input.type) + ' is not valid for input ' + chalk.green(name)
                    })
                }

                if(!input.description || input.description.length < 2) {
                    errors.push({
                        message: 'Input ' + chalk.green(name) + ' does not have a description (at least 1 character)'
                    })
                }
            });      
        }

        if(errors.length == 0) {
            resolve();
        } else {
            if(log) {
                // Print errors
                print(chalk.bold('\n⛔️ clay-config.js contains ' + chalk.red(errors.length) + ' error'+ (errors.length > 1 ? 's' : '') +':'));
                var i = 0;
                _.each(errors, function(error) {
                    print(chalk.red('- #'+i+' ') + error.message);
                    i++;
                })
                print('\n');
            }

            reject(errors);
        }
    });
}