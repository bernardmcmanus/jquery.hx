define([], function() {
  
  'use strict';

  return function() {
    it( 'should exist' , function( done ) {
      expect( window ).to.have.property( '$hx' );
      done();
    });
    
    it( 'should be chainable' , function( done ) {
      var original = $(SELECTOR).hx();
      expect( original.hx().hx() ).to.eql( original );
      done();
    });

    it( 'should return a $hx instance when a jQuery method is called' , function( done ) {
      var expectedLength = $(SELECTOR).hx().length;
      var result = $(SELECTOR).hx().slice( 1 );
      var numericKeys = Object.keys( result ).filter(function( key ) {
        return !isNaN(parseInt( key , 10 ));
      });
      expect( numericKeys.length ).to.eql( result.length );
      expect( result.length ).to.eql( expectedLength - 1 );
      expect( result ).to.be.an.instanceOf( $hx );
      done();
    });

    it( 'should keep the same $hx.$Element when chained' , function( done ) {
      var original = $(SELECTOR).first().hx();
      var chained = original.hx();
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.eql( chained.get( 0 ).$hx );
      done();
    });

    it( 'should get a new $hx.$Element when cloned' , function( done ) {
      var original = $(SELECTOR).first().hx();
      var cloned = original.clone();
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.not.eql( cloned.get( 0 ).$hx );
      done();
    });

    it( 'should get a new $hx.$Element when deeply cloned' , function( done ) {
      var original = $(SELECTOR).first().hx();
      original.get( 0 ).$hx.gnarly = true;
      var cloned = original.clone( true );
      expect( original.get( 0 ).$hx ).to.be.ok;
      expect( original.get( 0 ).$hx ).to.not.eql( cloned.get( 0 ).$hx );
      expect( cloned.get( 0 ).$hx ).to.not.have.property( 'gnarly' );
      done();
    });

    it( 'should transfer properties to descendant instances' , function( done ) {
      var original = $(SELECTOR).hx();
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
        $CONTAINER.append( $clone.css( 'background-color' , 'blue' ));
      });
      var nth = clone.eq(1);
      nth.css( 'background-color' , 'purple' );
      nth.css({ 'background-color': 'orangered' });
      done();
    });

    it( 'should transfer properties to descendant instances' , function( done ) {
      var original = $(SELECTOR).hx();
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
        $CONTAINER.append( $clone.css( 'background-color' , 'blue' ));
      });
      done();
    });
  };
});
