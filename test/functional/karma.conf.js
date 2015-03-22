module.exports = function( config ) {

  config.set({

    basePath: '../../',
    frameworks: [ 'mocha', 'sinon-chai' ],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'test/functional/performance-polyfill.js',
      'test/functional/bind-polyfill.js',
      'test/functional/once.js',
      'test/functional/tests.js',
      'dist/hx.js',
    ],
    exclude: [ ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { },
    reporters: [ 
      'mocha' 
    ],
    port: 9876,
    colors: true,
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // optionally run in chrome as well as phantomjs
    browsers: [ 
      'Chrome',
      //'PhantomJS'
    ]

  });
};
