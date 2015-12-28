import E$ from 'emoney';
import { $_reqAFrame } from 'core/util';

let instance = null,
  ticEvent = 'timer:tic',
  subscribers = 0,
  inprog = false;

export default class Timer extends E$ {
  constructor(){
    super();
    if (!instance) {
      instance = this;
    }
    return instance;
  }
  once( handler ){
    instance.$once( ticEvent , function once(){
      handler.apply( null , arguments );
      subscribers--;
    });
    subscribers++;
    instance._start();
  }
  on( handler ){
    instance.$when( ticEvent , handler );
    subscribers++;
    instance._start();
  }
  off( handler ){
    instance.$dispel( ticEvent , handler );
    subscribers--;
  }
  _start(){
    if (!inprog) {
      inprog = true;
      $_reqAFrame(function tic( timestamp ){
        instance.$emit( ticEvent , timestamp );
        if (!subscribers) {
          inprog = false;
        }
        if (inprog) {
          $_reqAFrame( tic );
        }
      });
    }
  }
}
