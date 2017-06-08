import {assert} from 'chai';
import _ from 'underscore';
import proxyquire from 'proxyquire';

var configLintFile = './../src/lint-config.js';
var lintConfig = (config) => {
    return proxyquire(configLintFile, {
        './get-clay-config.js': _.constant(config)
    })
}

describe('config linting tests', () => {
    it('should throw 3 errors on empty config', (done) => {
        var linter = lintConfig({});

        linter().then(function() {
            done(new Error('Could not detect errors'));
        }, function(errors) {
            assert.equal(errors.length, 3);
            done();
        })
    })

    it('should say that serviceName is required', function(done) {
        var linter = lintConfig({
            serviceDescription: 'description',
            serviceDisplayName: 'display_name'
        })

        linter().then(function() {
            done(new Error('Didnt raise an error for missing serviceName'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('serviceName') !== -1);

            done();
        })
    })

    it('should say that serviceDescription is required', function(done) {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDisplayName: 'display_name'
        })

        linter().then(function() {
            done(new Error('Didnt raise an error for missing serviceDesciption'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('serviceDescription') !== -1);

            done();
        })
    })

    it('should say that serviceDisplayName is required', function(done) {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDescription: 'description'
        })

        linter().then(function() {
            done(new Error('Didnt raise an error for missing serviceDisplayName'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('serviceDisplayName') !== -1);

            done();
        })
    })

    it('should detect wrong input type', function(done) {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDescription: 'description',
            serviceDisplayName: 'display_name',
            inputs: [
                {
                    type: 'wrongtype',
                    name: 'name',
                    description: 'description'
                }
            ]
        })
 
        linter().then(function() {
            done(new Error('Could not catch wrong type'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('wrongtype') !== -1);

            done();
        })
    })

    it('should detect missing input type', function(done) {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDescription: 'description',
            serviceDisplayName: 'display_name',
            inputs: [
                {
                    name: 'name',
                    description: 'description'
                }
            ]
        })
 
        linter().then(function() {
            done(new Error('Could not catch missing type'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('not have a valid') !== -1);

            done();
        })
    })

    it('should detect duplicate variables names', function(done) {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDescription: 'description',
            serviceDisplayName: 'display_name',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    description: 'description'
                },
                {
                    name: 'name',
                    type: 'text',
                    description: 'description'
                }
            ]
        })
 
        linter().then(function() {
            done(new Error('Could not catch duplicate variables names'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('Duplicate name') !== -1);

            done();
        })
    })

    it('should detect a missing variable name', (done) => {
        var linter = lintConfig({
            serviceName: 'service_name',
            serviceDescription: 'description',
            serviceDisplayName: 'display_name',
            inputs: [
                {
                    type: 'text',
                    description: 'description'
                }
            ]
        })
 
        linter().then(function() {
            done(new Error('Could not catch missing variable name'));
        }, function(errors) {
            assert.equal(errors.length, 1);
            assert.isTrue(errors[0].message.indexOf('needs a name') !== -1);

            done();
        })
    })
})