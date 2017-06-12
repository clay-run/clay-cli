/**
 * Deploy a project to the Clay Cloud
 * 
 * Folder architecture of the project:
 * - Project
 * |- Function1
 * | |- function1.js
 * | |- package.js
 * |
 * |- Function2
 * | |- function2.js
 * | |- package.js
 * 
 * Each subfolder is a normal clay function.
 */
var fs = require('fs'),
    chalk = require('chalk'),
    clui = require('clui'),
    _ = require('underscore'),
    path = require('path'),
    Spinner = clui.Spinner;

module.exports = function(projectDir) {
    var status = new Spinner('Searching for Clay functions..');
    status.start();
    var projectDir = projectDir || process.cwd();

    // Discovering the clay functions in subdirectories
    var files = fs.readdirSync(projectDir);
    var directories = [];

    _.each(files, function(file) {
        if(fs.statSync(file).isDirectory()
        && fs.existsSync(path.resolve(file, 'clay-config.json'))) {
            directories.push(file);
        }
    });
    status.stop();

    // If not clay function detected
    if(directories.length == 0) {
        console.log(chalk.red('Could not find any Clay function to deploy'));
        process.exit(0);
    }

    var plural = directories.length > 1 ? 's' : '';
    console.log(chalk.green('Found ') + chalk.green.bold(directories.length + ' function'+plural) + chalk.green(' to deploy'));

    var service = this;
    var serviceIndex = 0;
    function doneDeploying(err) {
        if(err) {
            console.log('An error occured during deployment');
            console.log('Please contact support@clay.run');
            if(process.env.CLAY_DEBUG) {
                console.log(err);
            }
            return;
        }
        console.log(chalk.black('---------------------------------'));
        console.log(chalk.green('🚀 ' + directories.length + ' functions have been deployed.'))
    }

    function deployNext() {
        var pathDir = path.resolve(projectDir, directories[serviceIndex]);

        service.deploy({ mode: 'PUT', dir: pathDir }).then(function() {
            serviceIndex++;

            if(serviceIndex == directories.length) {
                doneDeploying();
            } else {
                deployNext();
            }
        }, function(err) {
            doneDeploying(err);
        })
    }

    deployNext();
}