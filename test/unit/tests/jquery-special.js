define([ 'util' ], function( util ) {
  
  'use strict';

  return function() {
    describe( '#$css' , function() {
      it( 'should apply a style change when arguments are ( key , val )' , function( done ) {
        $(SELECTOR).hx().eq( 1 ).$css( 'background-color' , 'purple' );
        expect( $(SELECTOR).get( 1 ).style.backgroundColor ).to.equal( 'purple' );
        done();
      });

      it( 'should apply a style change when arguments are ( object )' , function( done ) {
        $(SELECTOR).hx().eq( 2 ).$css({ 'background-color': 'blue' });
        expect( $(SELECTOR).get( 2 ).style.backgroundColor ).to.equal( 'blue' );
        done();
      });

      it( 'should return val when arguments are ( key )' , function( done ) {
        expect( $(SELECTOR).hx().eq( 2 ).$css( 'background-color' )).to.equal( $(SELECTOR).get( 2 ).style.backgroundColor );
        done();
      });

      it( 'should add vendor prefixes to certain values' , function( done ) {
        var transitionString = 'opacity 400ms ease, transform 400ms ease';
        if (util.isFilterSupported) {
          transitionString += ', filter 400ms ease';
        }
        $(SELECTOR).hx().eq( 2 ).$css( 'transition' , transitionString );
        $(SELECTOR).hx().eq( 2 ).$css({ 'transform': 'translate3d(50px,0,0)' });
        var properties = (function() {
          var useragent = navigator.userAgent;
          if ((/webkit/i).test( useragent )) {
            return { transform: '-webkit-transform', transition: '-webkit-transition', filter: '-webkit-filter' };
          }
          if ((/firefox/i).test( useragent )) {
            return { transform: '-moz-transform', transition: '-moz-transition', filter: '-moz-filter' };
          }
          if ((/msie/i).test( useragent )) {
            return { transform: '-ms-transform', transition: '-ms-transition', filter: '-ms-filter' };
          }
        }());
        expect( $(SELECTOR).get( 2 ).style[properties.transform] ).to.be.ok;
        expect( $(SELECTOR).get( 2 ).style[properties.transition] ).to.be.ok;
        done();
      });
    });
  };
});
