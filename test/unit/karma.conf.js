module.exports = function( config ) {

  config.set({
    basePath: '../../',
    frameworks: [ 'mocha', 'sinon-chai' ],
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'test/unit/performance-polyfill.js',
      'test/unit/bind-polyfill.js',
      'test/unit/once.js',
      'test/unit/tests.js',
      'dist/hx.js',
    ],
    exclude: [],
    preprocessors: {},
    reporters: [ 'mocha' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [ 'PhantomJS' ]
  });

};
