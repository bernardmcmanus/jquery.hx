import E$ from 'emoney';
import * as util from 'core/util';

let instance = null,
  ticEvent = 'timer:tic',
  subscribers = 0,
  inprog = false;

export default instance = E$({
  events: Object.freeze({ tic: ticEvent }),
  once: function( handler ){
    instance.$once( ticEvent , function once(){
      handler.apply( null , arguments );
      subscribers--;
    });
    subscribers++;
    instance._start();
  },
  on: function( subscriber ){
    instance.$when( ticEvent , subscriber );
    subscribers++;
    instance._start();
  },
  off: function( subscriber ){
    instance.$dispel( ticEvent , subscriber );
    subscribers--;
  },
  _start: function(){
    if (!inprog) {
      inprog = true;
      util.reqAFrame(function tic( timestamp ){
        instance.$emit( ticEvent , timestamp );
        if (!subscribers) {
          inprog = false;
        }
        if (inprog) {
          util.reqAFrame( tic );
        }
      });
    }
  }
});
