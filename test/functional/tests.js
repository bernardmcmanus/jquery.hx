import $hx from 'hx';

window.$hx = $hx;

suite( '$hx' , function() {
  test( 'should exist' , function() {
    expect( $hx ).to.be.ok;
  });
  suite( '#new' , function() {
    test( 'should do it' , function() {
      $hx.new();
    });
  });
});
