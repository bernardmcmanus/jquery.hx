import tinycolor from 'tinycolor';
import {
  Property,
  Collection,
  Easing
} from 'main';
import Tweenbean from 'core/tweenbean';
import Aggregator from 'core/aggregator';
import * as util from 'core/util';

var Opacity = new Property({
  name: 'opacity',
  template: '${value}',
  initial: 1
});

var BackgroundColor = new Property({
  name: 'background-color',
  template: '${color}',
  initial: 'rgba(255,255,255,0)',
  precision: 0,
  getters: [
    [ 'color' , function( initial , eventual , pct , precision ){
      initial = tinycolor( initial ).toRgb();
      eventual = tinycolor( eventual ).toRgb();
      var color = util.$_map( eventual , function( value , key ){
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
  initial: 0
});

var TranslateY = new Property({
  name: 'translateY',
  template: 'translateY(${value}px)',
  initial: 0
});

var TranslateZ = new Property({
  name: 'translateZ',
  template: 'translateZ(${value}px)',
  initial: 0
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
  initial: 0
});

var RotateY = new Property({
  name: 'rotateY',
  template: 'rotateY(${value}deg)',
  initial: 0
});

var RotateZ = new Property({
  name: 'rotateZ',
  template: 'rotateZ(${value}deg)',
  initial: 0
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
  initial: 0
});

var Dropshadow = BackgroundColor.fork({
  name: 'drop-shadow',
  template: 'drop-shadow(${x}px ${y}px ${blur}px ${color})',
  initial: { x: 0, y: 0, blur: 0 }
});

var Opacity2 = new Property({
  name: 'opacity',
  template: 'opacity(${value}%)',
  initial: 100
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
      return property
        .tween()
        .start()
        .then(function(){
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
      thenDelay = 200,
      deferStart,
      property = Translate.fork().to({ x: 100, y: 100, z: 100 }),
      thenSpy = sinon.spy(),
      tweenSpy = sinon.spy(function(){
        $('.container > div').css( '-webkit-transform' , property.toString() );
      }),
      tweenbean = property.tween( tweenSpy );

    sinon.spy( tweenbean , 'start' );
    return tweenbean
      .start( duration )
      .then(function(){
        thenSpy();
        expect( tweenSpy.callCount ).to.be.at.least( minTweenCalls );
        expect( tweenbean.start ).to.have.been.called.once;
        tweenbean.start.restore();
      })
      .then(function(){
        thenSpy();
        return new Promise(function( resolve ){
          deferStart = Date.now();
          setTimeout( resolve , thenDelay );
        });
      })
      .then(function(){
        expect( thenSpy ).to.have.been.called.twice;
        expect( Date.now() - deferStart ).to.be.at.least( thenDelay );
        return property
          .to( property.initial )
          .tween(function(){
            $('.container > div').css( '-webkit-transform' , property.toString() );
          })
          .start( duration );
      });
  });
  test( 'should work' , function(){
    this.timeout( 3000 );
    var property = Translate.fork();
    return Promise.resolve().then(function(){
      return property
        .to({ x: 100 })
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , property.toString() );
        })
        .ease( Easing.easeInOutBack.get )
        .start( 500 );
    })
    .then(function(){
      return property
        .to({ y: 100 })
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , property.toString() );
        })
        .ease( Easing.easeInOutBack.get )
        .start( 500 );
    })
    .then(function(){
      return property
        .to({ x: 0 })
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , property.toString() );
        })
        .ease( Easing.easeInOutBack.get )
        .start( 500 );
    })
    .then(function(){
      return property
        .to({ y: 0 })
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , property.toString() );
        })
        .ease( Easing.easeInOutBack.get )
        .start( 500 );
    });
  });
  test( 'should tween non-numeric values' , function(){
    this.timeout( 4000 );
    return Promise.resolve().then(function(){
      var elements = $('.container > div').toArray().map(function( element ){
        var initial = $(element).css( 'background-color' );
        var property = BackgroundColor.fork().from( initial ).to( 'gold' );
        return $(element).data( 'property' , property );
      });
      var tweenbeans = elements.map(function( element ){
        var property = $(element).data( 'property' );
        return property
          .tween(function(){
            $(element).css( 'background-color' , property.toString() );
          })
          .start( 800 );
      });
      return Promise.all( tweenbeans ).then(function(){
        var tweenbeans = elements.map(function( element ){
          var property = $(element).data( 'property' );
          return property
            .to( property.initial )
            .tween(function(){
              $(element).css( 'background-color' , property.toString() );
            })
            .start( 800 );
        });
        return Promise.all( tweenbeans );
      });
    })
    .then(function(){
      var collection = new Collection( 'filter' , [
        Blur.fork().to( 2 ),
        Dropshadow.fork().from({ color: 'orchid' }).to({ x: 20, y: 20, blur: 2, color: 'gold' }),
        Opacity2.fork().to( 30 )
      ]);
      return collection
        .tween(function(){
          $('.container > div').css( '-webkit-filter' , collection.toString() );
        })
        .start( 800 )
        .then(function(){
          return collection
            .to(function( property ){
              return property.initial;
            })
            .tween(function(){
              $('.container > div').css( '-webkit-filter' , collection.toString() );
            })
            .start( 800 );
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
      return collection
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , collection.toString() );
        })
        .ease( Easing.easeOutQuad.get )
        .start( 800 );
    })
    .then(function(){
      return collection
        .to(function( property ){
          return property.initial;
        })
        .tween(function(){
          $('.container > div').css( '-webkit-transform' , collection.toString() );
        })
        .ease( Easing.easeOutQuad.get )
        .start( 800 );
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
      filter = new Collection( 'filter' , [
        Opacity2.fork().to( 30 )
      ]),
      aggregator = new Aggregator(function( css ){
        $('.container > div').css( css );
      })
      .add( 'transform' , function( css ){
        css['-webkit-transform'] = transform.toString();
      })
      .add( 'filter' , function( css ){
        css['-webkit-filter'] = filter.toString();
      });

    return Promise.all([
      transform
        .tween(function(){
          aggregator.fcall( 'transform' , $css );
        })
        .ease( Easing.easeOutQuad.get )
        .start( 800 ),
      filter
        .tween(function(){
          aggregator.fcall( 'filter' , $css );
        })
        .ease( Easing.easeOutQuad.get )
        .start( 400 )
    ])
    .then(function(){
      transform.to(function( property ){
        return property.initial;
      });
      filter.to(function( property ){
        return property.initial;
      });
      return Promise.all([
        transform
          .tween(function(){
            aggregator.fcall( 'transform' , $css );
          })
          .ease( Easing.easeOutQuad.get )
          .start( 800 ),
        filter
          .tween(function(){
            aggregator.fcall( 'filter' , $css );
          })
          .ease( Easing.easeOutQuad.get )
          .start( 400 )
      ]);
    });
  });
});
