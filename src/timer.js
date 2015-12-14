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
      E$.construct( instance );
    }
    return instance;
  }
  on( handler ){
    var data = { start: 0, elapsed: 0 };
    instance.$when( ticEvent , data , handler );
    subscribers++;
    instance.start();
  }
  off( handler ){
    instance.$dispel( ticEvent , handler );
    subscribers--;
  }
  start(){
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
