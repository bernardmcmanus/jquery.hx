import hx from 'main';
import Property from 'property';
import Collection from 'collection';
import { $_each } from 'core/util';

var Opacity = new Property({
  name: 'opacity',
  template: '${0}',
  initial: [ 1 ]
});

var Matrix = new Property({
  name: 'matrix',
  template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})',
  initial: {
    a1: 1, b1: 0, c1: 0, d1: 0,
    a2: 0, b2: 1, c2: 0, d2: 0,
    a3: 0, b3: 0, c3: 1, d3: 0,
    a4: 0, b4: 0, c4: 0, d4: 1
  }
});

var Matrix2d = new Property({
  name: 'matrix2d',
  template: 'matrix(${a},${b},${c},${d},${x},${y})',
  initial: { a: 1, b: 0, c: 0, d: 1, x: 0, y: 0 }
});

var Translate = new Property({
  name: 'translate',
  template: 'translate3d(${x}px,${y}px,${z}px)',
  initial: { x: 0, y: 0, z: 0 }
});

var TranslateX = new Property({
  name: 'translateX',
  template: 'translateX(${0}px)',
  initial: [ 0 ]
});

var TranslateY = new Property({
  name: 'translateY',
  template: 'translateY(${0}px)',
  initial: [ 0 ]
});

var TranslateZ = new Property({
  name: 'translateZ',
  template: 'translateZ(${0}px)',
  initial: [ 0 ]
});

var Translate2d = new Property({
  name: 'translate2d',
  template: 'translate(${x}px,${y}px)',
  initial: { x: 0, y: 0 }
});

var Scale = new Property({
  name: 'scale',
  template: 'scale3d(${x},${y},${z})',
  initial: { x: 1, y: 1, z: 1 }
});

var Scale2d = new Property({
  name: 'scale2d',
  template: 'scale(${x},${y})',
  initial: { x: 1, y: 1 }
});

var Rotate = new Property({
  name: 'rotate',
  template: 'rotate3d(${x}deg,${y}deg,${z}deg,${a})',
  initial: { x: 0, y: 0, z: 0, a: 0 }
});

var RotateX = new Property({
  name: 'rotateX',
  template: 'rotateX(${0}deg)',
  initial: [ 0 ]
});

var RotateY = new Property({
  name: 'rotateY',
  template: 'rotateY(${0}deg)',
  initial: [ 0 ]
});

var RotateZ = new Property({
  name: 'rotateZ',
  template: 'rotateZ(${0}deg)',
  initial: [ 0 ]
});

var Transform = new Collection( 'transform' , [
  Matrix.fork(),
  Matrix2d.fork(),
  Translate.fork(),
  TranslateX.fork(),
  TranslateY.fork(),
  TranslateZ.fork(),
  Translate2d.fork(),
  Scale.fork(),
  Scale2d.fork(),
  Rotate.fork(),
  RotateX.fork(),
  RotateY.fork(),
  RotateZ.fork()
]);

console.log(Transform);
console.log(Transform.toString());

suite( 'Property' , function(){
  var Translate = new Property({
    name: 'translate',
    template: 'translate3d(${x}px,${y}px,${z}px)',
    initial: { x: 0, y: 0, z: 0 }
  });

  suite( '#fork' , function(){
    test( 'should fork an existing property' , function(){
      var property = Translate.fork()
        .from({ x: 50, y: 50, z: 50 })
        .to({ x: 100, y: 100, z: 100 });
      expect( property ).to.not.equal( Translate );
      expect( property.initial ).to.eql({ x: 50, y: 50, z: 50 });
      expect( Translate.initial ).to.eql({ x: 0, y: 0, z: 0 });
    });
  });

  suite( '#tween' , function(){
    test( 'should work' , function(){
      var gotThenCalls = 0,
        thenDelay = 200,
        deferStart;

      var property = Translate.fork().to({ x: 100, y: 100, z: 100 });
      var tween = property
        .tween(function( pct ){
          console.log(pct,property.toString());
        })
        .for( 300 )
        .ease( hx.easing.easeOutQuad.get );

      return tween.then(function(){
        gotThenCalls++;
      })
      .then(function(){
        gotThenCalls++;
        return new Promise(function( resolve ){
          deferStart = Date.now();
          setTimeout( resolve , thenDelay );
        });
      })
      .then(function(){
        expect( gotThenCalls ).to.equal( 2 );
        expect( Date.now() - deferStart ).to.be.at.least( thenDelay );
      });
    });
    test( 'should work' , function(){
      var property = Translate.fork();
      return Promise.resolve().then(function(){
        return property
          .to({ x: 100 })
          .tween(function( pct ){
            $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
          })
          .for( 500 )
          .ease( hx.easing.easeInOutBack.get );
      })
      .then(function(){
        return property
          .to({ y: 100 })
          .tween(function( pct ){
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
});

suite( 'Collection' , function(){
  test( 'should be a collection of properties' , function(){
    var collection = new Collection([
      Translate.fork(),
      Scale.fork()
    ]);
    // console.log(collection.toString());
  });
});















