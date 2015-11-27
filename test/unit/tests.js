import hx from 'main';
import Property from 'property';
import * as Q from 'q.provider';

suite( 'Property' , function(){
  test( 'should exist' , function(){
    expect( Property ).to.be.ok;
  });
  test( 'should work' , function(){
    /*var p = new Property({
      name: 'matrix',
      template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})'
    });*/
    /*var p = new Property({
      name: 'matrix2d',
      template: 'matrix(${a},${b},${c},${d},${x},${y})'
    });*/
    var property = new Property({
      name: 'translate',
      template: 'translate3d(${x}px,${y}px,${z}px)',
      // defaults: { x: 0, y: 0, z: 0 },
      precision: 0
    });
    expect( property ).to.be.ok;
    var tween = property
      .from({ x: 0, y: 0, z: 0 })
      .to({ x: 100, y: 100, z: 100 })
      .tween(function( pct ){
        console.log(pct,property.toString());
      })
      .for( 300 )
      .ease( hx.easing.easeOutQuad.get )
      .then(function(){
        console.log('done');
      });
    console.log(property);
    console.log(property.initial);
    console.log(tween);
    return tween;
  });
  test( 'should work' , function(){
    var property = new Property({
      name: 'translate',
      template: 'translate3d(${x}px,${y}px,${z}px)',
      initial: { x: 0, y: 0, z: 0 }
    });
    return Promise.resolve().then(function(){
      return property
        .to({ x: 100 })
        .tween(function( pct ){
          // console.debug(property.toString());
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        })
        .for( 500 )
        .ease( hx.easing.easeInOutBack.get );
    })
    .then(function(){
      return property
        .to({ y: 100 })
        .tween(function( pct ){
          // console.debug(property.toString());
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        })
        .ease( hx.easing.easeInOutBack.get )
        .for( 500 );
    })
    .then(function(){
      console.log('done');
    });
  });
});















