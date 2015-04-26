module.exports = function( config ) {
  config.set({
    basePath: '../../',
    frameworks: [ 'requirejs' ],
    files: [
      { pattern: 'test/unit/lib/*.js', included: false },
      { pattern: 'test/unit/tasks/*.js', included: false },
      { pattern: 'test/unit/tests/*.js', included: false },
      { pattern: 'dist/hx.js', included: false },
      'test/unit/main.js',
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
