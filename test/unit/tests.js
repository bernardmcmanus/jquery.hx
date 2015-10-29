import Property from 'property';

suite( 'Property' , function(){
  test( 'should exist' , function(){
    expect( Property ).to.be.ok;
  });
  test( 'should work' , function(){
    var p = new Property({
      name: 'matrix',
      template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})'
    });
    console.log(p);
    console.log(
      p.tween(function( pct ){
        console.log(pct);
      })
      // .start()
      .for( 1000 )
      .then(function(){
        console.log('done');
      })
    );
    expect( p ).to.be.ok;
  });
});
