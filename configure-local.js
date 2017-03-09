"use strict";
const fs = require("fs");
const PATH = require("path");
const nconf = require("nconf");
var conf;
function reloadConfig() {
    const config_dir = conf.get('CONFIG_DIR');
    // then load the configuration that is specific to each environment
    var env_config_filename = PATH.join(config_dir, `${process.env.NODE_ENV}.json`);
    fs.accessSync(env_config_filename, fs.constants.R_OK);
    conf.file('instance', env_config_filename);
    // first load the configuration that is common to all configurations
    var common_config_filename = PATH.join(config_dir, 'common.json');
    fs.accessSync(common_config_filename, fs.constants.R_OK);
    conf.file('common', common_config_filename);
    ++reload_count;
}
// setup configuration
function configure() {
    conf = new nconf.Provider({});
    if (!process.env.NODE_ENV) {
        throw new Error('You must set the environment variable: NODE_ENV');
    }
    conf.argv();
    conf.env();
    const DEFAULTS = { 'CONFIG_DIR': 'config' };
    conf.defaults(DEFAULTS);
    reloadConfig();
}
function get(...args) {
    return conf.get.apply(conf, args);
}
function reset(done) {
    conf.reset(done);
    configure();
}
var reload_count = 0;
if (reload_count === 0) {
    configure();
}
var test = {
    reset
};
module.exports = {
    get,
    reloadConfig,
    test
};
