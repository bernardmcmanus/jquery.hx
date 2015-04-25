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

  /*afterEach(function( done ) {
    $container.empty();
    done();
  });*/

  describe( 'jquery.hx' , function() {
    
    it('should exist', function( done ) {
      expect( window ).to.have.property( '$hx' );
      done();
    });
    
    it('should be chainable', function( done ) {
      var original = $(ALL_SELECTOR).hx();
      expect( original.hx().hx() ).to.eql( original );
      done();
    });

    it('should return a $hx instance when a jQuery method is called', function( done ) {
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

    it('should transfer properties to descendant instances', function( done ) {
      var original = $(ALL_SELECTOR).hx();
      original.gnarly = true;
      var descendant = original.hx().slice();
      original.rad = true;
      expect( descendant.prevObject ).to.eql( original );
      expect( descendant.gnarly ).to.be.ok;
      expect( descendant.rad ).to.not.be.ok;
      console.log(original);
      original.it(function( $element ) {
        var clone = $element.clone();
        console.log(clone);
        $container.append( clone.css( 'background-color' , 'blue' ));
      });
      done();
    });
  });

}());



















