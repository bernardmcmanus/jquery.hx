import tinycolor from 'tinycolor';
import { Easing } from 'main';
import Property from 'engine/property';
import Collection from 'engine/collection';
import Tweenbean from 'engine/tweenbean';
import Aggregator from 'engine/aggregator';
import { $_each, $_map } from 'engine/util';

var Opacity = new Property({
  name: 'opacity',
  template: '${value}',
  initial: { value: 1 }
});

var BackgroundColor = new Property({
  name: 'background-color',
  template: '${color}',
  initial: { color: 'rgba(255,255,255,0)' },
  precision: 0,
  getters: [
    [ 'color' , function( initial , eventual , pct , precision ){
      initial = tinycolor( initial ).toRgb();
      eventual = tinycolor( eventual ).toRgb();
      var color = $_map( eventual , function( value , key ){
        return Property.valueAt( initial[key] , value , pct , 2 );
      });
      return tinycolor( color ).toRgbString();
    }]
  ]
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

/*var Transform = new Collection( 'transform' , [
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
]);*/

var Blur = new Property({
  name: 'blur',
  template: 'blur(${value}px)',
  initial: { value: 0 }
});

var Dropshadow = BackgroundColor.fork({
  name: 'drop-shadow',
  template: 'drop-shadow(${x}px ${y}px ${blur}px ${color})',
  initial: { x: 0, y: 0, blur: 0 }
});

var Opacity2 = new Property({
  name: 'opacity',
  template: 'opacity(${value}%)',
  initial: { value: 100 }
});

/*var Filter = new Collection( 'filter' , [
  Blur.fork(),
  Dropshadow.fork(),
  Opacity2.fork()
]);*/

suite( 'Property' , function(){
  suite( '#fork' , function(){
    test( 'should fork an existing property' , function(){
      var property = Translate.fork()
        .from({ x: 50, y: 50, z: 50 })
        .to({ x: 100, y: 100, z: 100 });
      expect( Translate.initial ).to.eql({ x: 0, y: 0, z: 0 });
      expect( property.plain ).to.eql({ x: 50, y: 50, z: 50 });
      expect( property.eventual ).to.eql({ x: 100, y: 100, z: 100 });
      new Tweenbean( property ).start().then(function(){
        expect( property.plain ).to.eql( property.eventual );
      });
    });
    test( 'should inherit properties from ancestor' , function(){
      expect( Dropshadow.initial ).to.not.eql( BackgroundColor.initial );
      expect( Dropshadow.color ).to.equal( BackgroundColor.color );
    });
  });
});

suite( 'Tweenbean' , function(){
  test( 'should work' , function(){
    var duration = 300,
      interval = Math.ceil( 1000 / 60 ),
      minTweenCalls = Math.floor( duration / interval ),
      gotTweenCalls = 0,
      gotThenCalls = 0,
      thenDelay = 200,
      deferStart;

    var property = Translate.fork().to({ x: 100, y: 100, z: 100 });
    var tweenbean = new Tweenbean( property , duration ).start(function(){
      $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      gotTweenCalls++;
    });

    return tweenbean.then(function(){
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
      return new Tweenbean( property , duration ).start(function(){
        $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
      });
    });
  });
  test( 'should work' , function(){
    this.timeout( 3000 );
    var property = Translate.fork();
    return Promise.resolve().then(function(){
      property.to({ x: 100 });
      return new Tweenbean( property , 500 )
        .ease( Easing.easeInOutBack.get )
        .start(function(){
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        });
    })
    .then(function(){
      property.to({ y: 100 });
      return new Tweenbean( property , 500 )
        .ease( Easing.easeInOutBack.get )
        .start(function(){
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        });
    })
    .then(function(){
      property.to({ x: 0 });
      return new Tweenbean( property , 500 )
        .ease( Easing.easeInOutBack.get )
        .start(function(){
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        });
    })
    .then(function(){
      property.to({ y: 0 });
      return new Tweenbean( property , 500 )
        .ease( Easing.easeInOutBack.get )
        .start(function(){
          $('.tgt-container > div').css( '-webkit-transform' , property.toString() );
        });
    });
  });
  test( 'should tween non-numeric values' , function(){
    this.timeout( 4000 );
    return Promise.resolve().then(function(){
      var elements = $('.tgt-container > div').toArray().map(function( element ){
        var initial = $(element).css( 'background-color' );
        var collection = new Collection( 'background-color' , [
          BackgroundColor.fork().from({ color: initial }).to({ color: 'gold' })
        ]);
        return $(element).data( 'collection' , collection );
      });
      var promises = elements.map(function( element ){
        var collection = $(element).data( 'collection' );
        return collection.tween( 800 , function(){
          $(element).css( 'background-color' , collection.toString() );
        });
      });
      return Promise.all( promises ).then(function(){
        var promises = elements.map(function( element ){
          var collection = $(element).data( 'collection' );
          $_each( collection , function( property ){
            property.to( property.initial );
          });
          return collection.tween( 800 , function(){
            $(element).css( 'background-color' , collection.toString() );
          });
        });
        return Promise.all( promises );
      });
    })
    .then(function(){
      var collection = new Collection( 'filter' , [
        Blur.fork().to({ value: 2 }),
        Dropshadow.fork().from({ color: 'orchid' }).to({ x: 20, y: 20, blur: 2, color: 'gold' }),
        Opacity2.fork().to({ value: 30 })
      ]);
      return collection.tween( 800 , function(){
        $('.tgt-container > div').css( '-webkit-filter' , collection.toString() );
      })
      .then(function(){
        $_each( collection , function( property ){
          property.to( property.initial );
        });
        return collection.tween( 800 , function(){
          $('.tgt-container > div').css( '-webkit-filter' , collection.toString() );
        });
      });
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
      return collection.tween( 800 , Easing.easeOutQuad.get , function(){
        $('.tgt-container > div').css( '-webkit-transform' , collection.toString() );
      });
    })
    .then(function(){
      $_each( collection , function( property ){
        property.to( property.initial );
      });
      return collection.tween( 800 , Easing.easeOutQuad.get , function(){
        $('.tgt-container > div').css( '-webkit-transform' , collection.toString() );
      });
    });
  });
});

suite( 'Aggregator' , function(){
  test( 'should work' , function(){
    var $css = {},
      transform = new Collection( 'transform' , [
        TranslateZ.fork(),
        Translate.fork().to({ x: 100, y: 100 }),
        Rotate.fork().from({ x: 1, y: 1, z: 1 }).to({ a: 360 }),
        Scale.fork().to({ x: 2, y: 2 })
      ]),
      opacity = new Collection( 'opacity' , [
        Opacity.fork().to({ value: 0.3 })
      ]),
      aggregator = new Aggregator(function( css ){
        $('.tgt-container > div').css( css );
      })
      .add( 'transform' , function( css ){
        css['-webkit-transform'] = transform.toString();
      })
      .add( 'opacity' , function( css ){
        css.opacity = opacity.toString();
      });

    return Promise.all([
      transform.tween( 800 , Easing.easeOutQuad.get , function(){
        aggregator.fcall( 'transform' , $css );
      }),
      opacity.tween( 400 , Easing.easeOutQuad.get , function(){
        aggregator.fcall( 'opacity' , $css );
      })
    ])
    .then(function(){
      $_each( transform , function( property ){
        property.to( property.initial );
      });
      $_each( opacity , function( property ){
        property.to( property.initial );
      });
      return Promise.all([
        transform.tween( 800 , Easing.easeOutQuad.get , function(){
          aggregator.fcall( 'transform' , $css );
        }),
        opacity.tween( 400 , Easing.easeOutQuad.get , function(){
          aggregator.fcall( 'opacity' , $css );
        })
      ]);
    });
  });
});
