import Property from 'property';
import Collection from 'collection';
import Tweenbean from 'tweenbean';
import Tween from 'tween';
import { Easing } from 'main';
import { $_each } from 'core/util';

var Opacity = new Property({
  name: 'opacity',
  template: '${value}',
  initial: { value: 1 }
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
  template: 'translateX(${value}px)',
  initial: { value: 0 }
});

var TranslateY = new Property({
  name: 'translateY',
  template: 'translateY(${value}px)',
  initial: { value: 0 }
});

var TranslateZ = new Property({
  name: 'translateZ',
  template: 'translateZ(${value}px)',
  initial: { value: 0 }
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
  template: 'rotate3d(${x},${y},${z},${a}deg)',
  initial: { x: 0, y: 0, z: 0, a: 0 },
  getters: [
    [ 'x' , 'y' , 'z' , function( initial , eventual ){
      return eventual;
    }]
  ]
});

var RotateX = new Property({
  name: 'rotateX',
  template: 'rotateX(${value}deg)',
  initial: { value: 0 }
});

var RotateY = new Property({
  name: 'rotateY',
  template: 'rotateY(${value}deg)',
  initial: { value: 0 }
});

var RotateZ = new Property({
  name: 'rotateZ',
  template: 'rotateZ(${value}deg)',
  initial: { value: 0 }
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

suite( 'Property' , function(){
  suite( '#fork' , function(){
    test( 'should fork an existing property' , function(){
      var property = Translate.fork()
        .from({ x: 50, y: 50, z: 50 })
        .to({ x: 100, y: 100, z: 100 });
      expect( Translate.initial ).to.eql({ x: 0, y: 0, z: 0 });
      expect( property.plain ).to.eql({ x: 50, y: 50, z: 50 });
      expect( property.eventual ).to.eql({ x: 100, y: 100, z: 100 });
      var tweenbean = new Tweenbean( property );
      return new Tween( tweenbean )
        .run()
        .then(function(){
          expect( property.plain ).to.eql( property.eventual );
        });
    });
  });
});

suite( 'Tween' , function(){
  test( 'should work' , function(){
    var duration = 300,
      interval = Math.ceil( 1000 / 60 ),
      minTweenCalls = Math.floor( duration / interval ),
      gotTweenCalls = 0,
      gotThenCalls = 0,
      thenDelay = 200,
      deferStart;

    var property = Translate.fork().to({ x: 100, y: 100, z: 100 });
    var tweenbean = new Tweenbean( property , duration );
    var tween = new Tween( tweenbean ).run(function(){
      $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      gotTweenCalls++;
    });

    return tween.then(function(){
      expect( gotTweenCalls ).to.be.at.least( minTweenCalls );
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
      property.to( property.initial );
      var tweenbean = new Tweenbean( property , duration );
      return new Tween( tweenbean ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    });
  });
  test( 'should work' , function(){
    var property = Translate.fork();
    return Promise.resolve().then(function(){
      var tweenbean = new Tweenbean( property , 300 , Easing.easeInOutBack.get );
      property.to({ x: 100 });
      return new Tween( tweenbean ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    })
    .then(function(){
      var tweenbean = new Tweenbean( property , 300 , Easing.easeInOutBack.get );
      property.to({ y: 100 });
      return new Tween( tweenbean ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    })
    .then(function(){
      var tweenbean = new Tweenbean( property , 300 , Easing.easeInOutBack.get );
      property.to({ x: 0 });
      return new Tween( tweenbean ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    })
    .then(function(){
      var tweenbean = new Tweenbean( property , 300 , Easing.easeInOutBack.get );
      property.to({ y: 0 });
      return new Tween( tweenbean ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    })
    .then(function(){
      console.log('done');
    });
  });
});

suite( 'Collection' , function(){
  test( 'should work' , function(){
    var collection = new Collection( 'transform' , [
      TranslateZ.fork(),
      Translate.fork().to({ x: 100, y: 100 }),
      Rotate.fork().from({ x: 1, y: 1, z: 1 }).to({ a: 360 }),
      Scale.fork().to({ x: 2, y: 2 })
    ]);
    return Promise.resolve().then(function(){
      var tweenbeans = collection.order.map(function( name ){
        var property = collection[name];
        return new Tweenbean( property , 800 , Easing.easeOutQuad.get );
      });
      return new Tween( tweenbeans ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , collection.toString() );
      });
    })
    .then(function(){
      var tweenbeans = collection.order.map(function( name ){
        var property = collection[name];
        return new Tweenbean( property , 800 , Easing.easeOutQuad.get );
      });
      $_each( collection , function( property ){
        property.to( property.initial );
      });
      return new Tween( tweenbeans ).run(function(){
        $('.tgt-container > div').css( '-webkit-transform' , collection.toString() );
      });
    });
  });
});















