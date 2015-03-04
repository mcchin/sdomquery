var fs = require('fs');

module.exports = function(config) {

  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  var customLaunchers = {
/*
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
*/
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9'
    }
  };

  config.set({

    basePath: '',


    frameworks: ['mocha', 'chai', 'effroi', 'phantomjs-shim'],


    files: [
      'html/**/*.html',
      'lib/**/*.js',
      'specs/**/*.js'
    ],


    exclude: [
      '**/*.swp'
    ],


    preprocessors: {
      'html/**/*.html' : 'html2js'         
    },


    reporters: ['mocha'],


    port: 9876,


    colors: true,


    logLevel: config.LOG_INFO,


    sauceLabs: {
      testName: 'sDomQuery test',
      startConnect: false
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),


    singleRun: true

  });
};
