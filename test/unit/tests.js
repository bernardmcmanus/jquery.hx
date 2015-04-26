(function() {

  'use strict';

  var ALL_SELECTOR = '.tgt0,.tgt1,.tgt2';
  var $container = $(document.createElement( 'div' ))
    .addClass( 'tgt-container' )
    .appendTo( 'body' );

  beforeEach(function( done ) {
    $container.empty();
    var colors = [ '#FF59C7' , '#97F224' , '#F4AE29' ];
    colors.forEach(function( color , i ) {
      var div = document.createElement( 'div' );
      $(div)
        .css({
          width: '100px',
          height: '100px',
          'margin-left': (i ? '20px' : '60px'),
          'background-color': color
        })
        .addClass( 'tgt' + i )
        .appendTo( $container );
    });
    done();
  });

  function isFilterSupported() {
    var $div = $(document.createElement( 'div' ));
    $('body').append( $div );
    $div.css( 'transition' , 'filter 400ms ease' );
    var supported = ($div.css( 'transition' ) != '');
    $div.remove();
    return supported;
  }

  describe( 'jquery.hx ($hx)' , function() {
    
    it( 'should exist' , function( done ) {
      expect( window ).to.have.property( '$hx' );
      done();
    });
    
    it( 'should be chainable' , function( done ) {
      var original = $(ALL_SELECTOR).hx();
      expect( original.hx().hx() ).to.eql( original );
      done();
    });

    it( 'should return a $hx instance when a jQuery method is called' , function( done ) {
      var expectedLength = $(ALL_SELECTOR).hx().length;
      var result = $(ALL_SELECTOR).hx().slice( 1 );
      var numericKeys = Object.keys( result ).filter(function( key ) {
        return !isNaN(parseInt( key , 10 ));
      });
      expect( numericKeys.length ).to.eql( result.length );
      expect( result.length ).to.eql( expectedLength - 1 );
      expect( result ).to.be.an.instanceOf( $hx );
      done();
    });

    it( 'should keep the same $hx.$Element when chained' , function( done ) {
      var original = $(ALL_SELECTOR).first().hx();
      var chained = original.hx();
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.eql( chained.get( 0 ).$hx );
      done();
    });

    it( 'should get a new $hx.$Element when cloned' , function( done ) {
      var original = $(ALL_SELECTOR).first().hx();
      var cloned = original.clone();
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.not.eql( cloned.get( 0 ).$hx );
      done();
    });

    it( 'should get a new $hx.$Element when deeply cloned' , function( done ) {
      var original = $(ALL_SELECTOR).first().hx();
      original.get( 0 ).$hx.gnarly = true;
      var cloned = original.clone( true );
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.not.eql( cloned.get( 0 ).$hx );
      expect( cloned.get( 0 ).$hx ).to.not.have.property( 'gnarly' );
      done();
    });

    it( 'should transfer properties to descendant instances' , function( done ) {
      var original = $(ALL_SELECTOR).hx();
      original.gnarly = true;
      var descendant = original.hx().slice();
      original.rad = true;
      expect( descendant.prevObject ).to.eql( original );
      expect( descendant.gnarly ).to.be.ok;
      expect( descendant.rad ).to.not.be.ok;
      original.it(function( $element ) {
        expect( $element ).to.have.length( 1 );
      });
      descendant.it(function( $element , i ) {
        expect( $element ).to.have.length( 1 );
        expect( $element ).to.equal( original.get( i ).$hx );
      });
      var clone = original.clone().it(function( $clone ) {
        expect( $clone ).to.have.length( 1 );
        $container.append( $clone.css( 'background-color' , 'blue' ));
      });
      var nth = clone.eq(1);
      nth.css( 'background-color' , 'purple' );
      nth.css({ 'background-color': 'orangered' });
      done();
    });

    it( 'should transfer properties to descendant instances' , function( done ) {
      var original = $(ALL_SELECTOR).hx();
      original.gnarly = true;
      var descendant = original.hx().slice();
      original.rad = true;
      expect( descendant.prevObject ).to.eql( original );
      expect( descendant.gnarly ).to.be.ok;
      expect( descendant.rad ).to.not.be.ok;
      original.it(function( $element ) {
        expect( $element ).to.have.length( 1 );
      });
      descendant.it(function( $element , i ) {
        expect( $element ).to.have.length( 1 );
        expect( $element ).to.equal( original.get( i ).$hx );
      });
      var clone = original.clone().it(function( $clone ) {
        expect( $clone ).to.have.length( 1 );
        $container.append( $clone.css( 'background-color' , 'blue' ));
      });
      done();
    });
  });

  describe( 'jquery-special ($$)' , function() {
    describe( '#$css' , function() {
      it( 'should apply a style change when arguments are ( key , val )' , function( done ) {
        $(ALL_SELECTOR).hx().eq( 1 ).$css( 'background-color' , 'purple' );
        expect( $(ALL_SELECTOR).get( 1 ).style.backgroundColor ).to.equal( 'purple' );
        done();
      });
      it( 'should apply a style change when arguments are ( object )' , function( done ) {
        $(ALL_SELECTOR).hx().eq( 2 ).$css({ 'background-color': 'blue' });
        expect( $(ALL_SELECTOR).get( 2 ).style.backgroundColor ).to.equal( 'blue' );
        done();
      });
      it( 'should return val when arguments are ( key )' , function( done ) {
        expect( $(ALL_SELECTOR).hx().eq( 2 ).$css( 'background-color' )).to.equal( $(ALL_SELECTOR).get( 2 ).style.backgroundColor );
        done();
      });
      it( 'should add vendor prefixes to certain values' , function( done ) {
        var transitionString = 'opacity 400ms ease, transform 400ms ease';
        if (isFilterSupported()) {
          transitionString += ', filter 400ms ease';
        }
        $(ALL_SELECTOR).hx().eq( 2 ).$css( 'transition' , transitionString );
        $(ALL_SELECTOR).hx().eq( 2 ).$css({ 'transform': 'translate3d(50px,0,0)' });
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
        expect( $(ALL_SELECTOR).get( 2 ).style[properties.transform] ).to.be.ok;
        expect( $(ALL_SELECTOR).get( 2 ).style[properties.transition] ).to.be.ok;
        done();
      });
    });
  });

}());



















