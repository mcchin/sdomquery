var fs = require('fs');

module.exports = function(config) {

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  var customLaunchers = {
    sl_chrome_35: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_chrome_36: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '36'
    },
    sl_chrome_37: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '37'
    },
    sl_chrome_38: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '38'
    },
    sl_chrome_39: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '39'
    },
    sl_chrome_40: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '40'
    },
    sl_firefox_30: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '30'
    },
    sl_firefox_31: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '31'
    },
    sl_firefox_32: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '32'
    },
    sl_firefox_33: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '33'
    },
    sl_firefox_34: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '34'
    },
    sl_firefox_35: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '35'
    },
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.9',
      version: '7.1'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
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


    reporters: ['mocha', 'saucelabs'],


    port: 9876,


    colors: true,


    logLevel: config.LOG_DEBUG,


    sauceLabs: {
      testName: 'sDomQuery test',
      //startConnect: false,
      tags: (!process.env.SAUCE_USERNAME || !process.env.TRAVIS_BRANCH) ? [] : [ process.env.SAUCE_USERNAME+"@"+process.env.TRAVIS_BRANCH || process.env.SAUCE_USERNAME+"@local" ],
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      }      
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),


    singleRun: true

  });
};
