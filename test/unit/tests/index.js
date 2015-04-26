define([
  'tasks/setup-each',
  'tests/general',
  'tests/jquery-special'
],
function(
  setupEach,
  $hx,
  $$
){
  beforeEach( setupEach );
  describe( 'jquery.hx ($hx)' , $hx );
  describe( 'jquery-special ($$)' , $$ );
});