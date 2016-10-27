// Karma configuration
// Generated on Tue Sep 02 2014 23:03:20 GMT+0200 (CEST)

const minimist = require('minimist');
const argv = minimist(process.argv);

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [ 'mocha', 'sinon-chai' ],
    files: [ 
      'test/performance-polyfill.js',
      'test/bind-polyfill.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/wee-promise/dist/wee-promise.min.js',
      'dist/hx.js',
      'test/once.js',
      'test/tests.js'
    ],
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { },
    reporters: [ 
      'mocha' 
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [
      argv.chrome ? 'Chrome' : 'PhantomJS'
    ]
  });
};
