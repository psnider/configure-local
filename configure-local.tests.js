"use strict";
const CHAI = require('chai');
const expect = CHAI.expect;
describe('configure-local', function () {
    process.env.NODE_ENV = 'development';
    var configure = require('configure-local');
    function scopeEnvVars(env, test) {
        var saved = process.env;
        process.env = env;
        test();
        process.env = saved;
    }
    function scopeArgs(args, test) {
        var saved = process.argv;
        process.argv = args.concat(args);
        test();
        process.argv = saved;
    }
    describe('settings and overrides', function () {
        describe('using config files only', function () {
            it('should respect setting specified only in config/common.json', function () {
                expect(configure.get('external_service:api_key')).to.equal('0a1b2c3d');
            });
            it('should respect setting specified only in config/development.json', function () {
                expect(configure.get('PORT')).to.equal(1001);
            });
            it('should override setting in config/common.json with one from config/development.json', function () {
                expect(configure.get('external_service:url')).to.equal('https://external_service.co/api/v2/');
            });
        });
        describe('using environment variables', function () {
            it('should override a setting in config/common.json', function () {
                scopeEnvVars({ NODE_ENV: 'development', 'external_service:api_key': 'key_for_testing' }, () => {
                    configure.test.reset();
                    expect(configure.get('external_service:api_key')).to.equal('key_for_testing');
                });
            });
            it('should override a setting in config/development.json', function () {
                scopeEnvVars({ NODE_ENV: 'development', PORT: '3333' }, () => {
                    configure.test.reset();
                    expect(configure.get('PORT')).to.equal('3333');
                });
            });
        });
        describe('using command line arguments', function () {
            it('should override a setting in config/development.json', function () {
                scopeArgs(['--PORT', '8888'], function () {
                    configure.test.reset();
                    expect(configure.get('PORT')).to.equal(8888);
                });
            });
            it('should override a setting in environment variables', function () {
                scopeEnvVars({ NODE_ENV: 'development', PORT: '3333' }, () => {
                    scopeArgs(['--PORT', '8888'], function () {
                        configure.test.reset();
                        expect(configure.get('PORT')).to.equal(8888);
                    });
                });
            });
        });
        describe('using defaults', function () {
            it('should return default when not overridden', function () {
                expect(configure.get('CONFIG_DIR')).to.equal('config');
            });
            it('should be overridden by environment variable', function (done) {
                process.env.CONFIG_DIR = '/var/config';
                try {
                    // test.reset() throws an error because the config file doesnt exist
                    configure.test.reset();
                }
                catch (error) {
                    expect(error.message).to.equal("ENOENT: no such file or directory, access '/var/config/development.json'");
                    done();
                }
                var env = process.env;
                delete env['CONFIG_DIR'];
            });
        });
    });
    describe('Configuration selection by instance environment name', function () {
        it('should throw an error if NODE_ENV is unset', function () {
            var saved = process.env.NODE_ENV;
            process.env.NODE_ENV = undefined;
            expect(configure.test.reset).to.throw(Error);
            process.env.NODE_ENV = saved;
        });
        it('should throw an error if NODE_ENV doesnt match a config file', function () {
            var saved = process.env.NODE_ENV;
            process.env.NODE_ENV = 'devel';
            expect(configure.test.reset).to.throw(Error);
            process.env.NODE_ENV = saved;
        });
        it('should select production when NODE_ENV=production', function () {
            scopeEnvVars({ NODE_ENV: 'production' }, () => {
                configure.test.reset();
                expect(configure.get('PORT')).to.equal(2002);
            });
        });
    });
});
