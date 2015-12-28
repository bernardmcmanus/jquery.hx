import Promise from 'wee-promise';
import 'jquery/main';

suite( '$.hx' , function(){
  test( 'should work' , function(){
    console.log($.hx);
  });
});

suite( '$.fn.hx' , function(){
  test( 'should work' , function(){
    var a = $('.container > div')
      .transform({
        translate: { x: 100, y: 100 }
      })
      .tween( 500 )
      .transform({
        translate: { x: 0, y: 0 }
      })
      .tween( 500 );
    console.log(a.data());
    return a.promise();
  });
});
