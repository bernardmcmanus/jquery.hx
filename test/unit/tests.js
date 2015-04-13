(function() {

  'use strict';

  var ALL_SELECTOR = '.tgt0,.tgt1,.tgt2';

  beforeEach(function( done ) {
    $('.tgt-container').empty();
    var colors = [ '#FF59C7' , '#97F224' , '#F4AE29' ];
    colors.forEach(function( color , i ) {
      $(document.createElement( 'div' ))
        .css({
          width: '100px',
          height: '100px',
          'margin-left': (i ? '20px' : '60px'),
          'background-color': color
        })
        .addClass( 'tgt' + i )
        .appendTo( '.tgt-container' );
    });
    done();
  });

  describe( 'jquery.hx' , function() {
    
    it('should exist', function( done ) {
      expect( window ).to.have.property( '$hx' );
      done();
    });
    
    it('should work', function( done ) {
      console.log($(ALL_SELECTOR).hx().hx().hx().slice( 1 ));
      done();
    });
  });

}());



















