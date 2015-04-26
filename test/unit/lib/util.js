define([], function() {
  'use strict';
  return {
    get isFilterSupported() {
      var $div = $(document.createElement( 'div' ));
      $('body').append( $div );
      $div.css( 'transition' , 'filter 400ms ease' );
      var supported = ($div.css( 'transition' ) != '');
      $div.remove();
      return supported;
    }
  };
});
