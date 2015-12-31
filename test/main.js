require.config({
  paths: {
    'once': '/test/once',
    'jquery': '/bower_components/jquery/dist/jquery',
    'mocha': '/bower_components/mocha/mocha',
    'chai': '/bower_components/chai/chai',
    'sinon': '/bower_components/sinon/index',
    'sinon-chai': '/bower_components/sinon-chai/lib/sinon-chai',
    'stats': '/bower_components/stats.js/build/stats.min',
    'tests': 'tests.compiled'
  },
  shim: {
    'jquery': { exports: '$' },
    'mocha': { exports: 'mocha' },
    'chai': { exports: 'chai' },
    'sinon': { exports: 'sinon' },
    'sinon-chai': [ 'chai' , 'sinon' ],
    'stats': { exports: 'Stats' },
    'once': [ 'jquery' ],
    'tests': [ 'mocha' , 'sinon-chai' , 'once' ]
  }
});

define( 'stats-init' , [ 'stats' , 'mocha' ], function( Stats , mocha ){
  window.stats = new Stats();
  // 0: fps, 1: ms
  stats.setMode( 0 );
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '10px';
  stats.domElement.style.bottom = '10px';
  document.body.appendChild( stats.domElement );
  return stats;
});

define( 'init' , [ 'jquery' , 'mocha' , 'chai' , 'sinon' , 'sinon-chai' , 'stats-init' ], function( $ , mocha , chai , sinon , sinonChai , stats ){
  window.$ = $;
  window.mocha = mocha;
  window.expect = chai.expect;
  window.sinon = sinon;
  mocha.setup( 'tdd' );
  mocha.reporter( 'html' );
  chai.use( sinonChai );

  var interval = setInterval(function(){
    stats.begin();
    // your code goes here
    stats.end();
  },Math.round( 1000 / 60 ));

  suiteTeardown(function(){
    clearInterval( interval );
  });
});

require([ 'init' , 'tests' ], function(){
  mocha.run();
});
