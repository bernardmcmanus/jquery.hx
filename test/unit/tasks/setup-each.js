define([], function() {
  'use strict';
  return function( done ) {
    $CONTAINER.empty();
    COLORS.forEach(function( color , i ) {
      var div = document.createElement( 'div' );
      $(div)
        .css({
          width: '100px',
          height: '100px',
          'margin-left': (i ? '20px' : '60px'),
          'background-color': color
        })
        .addClass( 'tgt' + i )
        .appendTo( $CONTAINER );
    });
    done();
  };
});
