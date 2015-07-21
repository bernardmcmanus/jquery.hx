(function() {

  'use strict';

  describe( 'jquery.hx' , function() {
    it('should exist', function() {
      var count = 0;
      $hx.$timer.on(function tic( e ) {
        console.log(e.timeStamp);
        if (count >= 10) {
          $hx.$timer.off( tic );
        }
        count++;
      });
    });
  });

}());
