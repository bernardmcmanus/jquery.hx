import Promise from 'wee-promise';
import 'jquery/main';

suite( '$.hx' , function(){
  test( 'should work' , function(){
    console.log($.hx);
  });
});

suite( '$.fn.hx' , function(){
  test( 'should properly extend the jQuery prototype' , function(){
    var $divs = $('.container > div');
    expect( $divs.length ).to.be.at.least( 3 );
    expect( $divs.slice( 1 , 3 )).to.have.length( 2 );
    expect( $divs.slice( 1 , 3 ).first()[0] ).to.equal( $divs[1] );
  });
  test( 'should work' , function(){
    this.timeout( 5000 );
    var a = $('.container > div')
      .translate({ x: 100, y: 100 })
      .tween( 500 )
      .rotateZ( 180 )
      .tween( 500 )
      .opacity( 0.3 )
      .tween( 500 )
      .opacity( 1 )
      .rotate({ z: 1, a: 180 })
      .transform({
        translate: { x: 0, y: 0 },
        rotateZ: 360
      })
      .tween( 1000 );
    console.log(a.data());
    return a.promise().then(function(){
      var b = a.last();
      console.log(b);
    });
  });
});
