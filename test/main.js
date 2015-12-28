require.config({
  paths: {
    'once': '/test/once',
    'jquery': '/bower_components/jquery/dist/jquery',
    'mocha': '/bower_components/mocha/mocha',
    'chai': '/bower_components/chai/chai',
    'sinon': '/bower_components/sinon/index',
    'sinon-chai': '/bower_components/sinon-chai/lib/sinon-chai',
    'tests': 'tests.compiled'
  },
  shim: {
    'jquery': { exports: '$' },
    'mocha': { exports: 'mocha' },
    'chai': { exports: 'chai' },
    'sinon': { exports: 'sinon' },
    'sinon-chai': [ 'chai' , 'sinon' ],
    'once': [ 'jquery' ],
    'tests': [ 'mocha' , 'sinon-chai' , 'once' ]
  }
});
define( 'init' , [ 'jquery' , 'mocha' , 'chai' , 'sinon-chai' ], function( $ , mocha , chai , sinonChai ) {
  window.$ = $;
  window.mocha = mocha;
  window.expect = chai.expect;
  mocha.setup( 'tdd' );
  mocha.reporter( 'html' );
  chai.use( sinonChai );
});
require([ 'init' , 'tests' ], function() {
  mocha.run();
});
