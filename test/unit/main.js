require.config({
  baseUrl: 'http://localhost:9001/test/unit',
  paths: {
    '$hx': 'http://localhost:9001/dist/hx',
    'jquery': 'http://localhost:9001/bower_components/jquery/dist/jquery',
    'mocha': 'http://localhost:9001/bower_components/mocha/mocha',
    'chai': 'http://localhost:9001/bower_components/chai/chai',
    'sinon': 'http://localhost:9001/bower_components/sinon/index',
    'sinon-chai': 'http://localhost:9001/node_modules/sinon-chai/lib/sinon-chai',
    'lib/bind-polyfill': 'http://localhost:9001/test/unit/lib/bind-polyfill',
    'lib/performance-polyfill': 'http://localhost:9001/test/unit/lib/performance-polyfill',
    'util': 'http://localhost:9001/test/unit/lib/util'
  },
  shim: {
    'tests/index': [ '$hx' , 'lib/once' , 'init' ],
    'jquery': { exports: '$' },
    'mocha': { exports: 'mocha' },
    'chai': { exports: 'chai' },
    'sinon': { exports: 'sinon' },
    'sinon-chai': [ 'chai' , 'sinon' ],
    'lib/once': [ 'jquery' ],
    '$hx': {
      exports: '$hx',
      deps: [ 'jquery' ]
    }
  },
  deps: [ 'lib/bind-polyfill' , 'lib/performance-polyfill' , 'run' ],
  callback: window.__karma__.start
});
require([ 'chai' , 'sinon-chai' ], function( chai , sinonChai ) {
  window.chai = chai;
  window.expect = chai.expect;
  chai.use( sinonChai );
});
define( 'init' , [ 'jquery' , 'mocha' , 'sinon-chai' ], function( $ , mocha ) {
  mocha.setup( 'bdd' );
  mocha.reporter( 'html' );
});
define( 'run' , [ 'init' , 'tests/index' ], function() {
  $('head').append( '<link rel="stylesheet" type="text/css" href="http://localhost:9001/bower_components/mocha/mocha.css" />' );
  $('head').append( '<link rel="stylesheet" type="text/css" href="http://localhost:9001/test/unit/style.css" />' );
  $('body').prepend( '<div id="mocha"></div>' );
  window.SELECTOR = '.tgt0,.tgt1,.tgt2';
  window.COLORS = [ '#FF59C7' , '#97F224' , '#F4AE29' ];
  window.$CONTAINER = $(document.createElement( 'div' ))
    .addClass( 'tgt-container' )
    .appendTo( 'body' );
  mocha.run();
});
