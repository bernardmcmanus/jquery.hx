import E$ from 'emoney';
import * as util from 'core/util';

let instance = null,
  ticEvent = 'timer:tic',
  subscribers = 0,
  inprog = false;

export default class Timer extends E$ {
  static get events(){
    return { tic: ticEvent };
  }
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
  on( subscriber ){
    instance.$when( ticEvent , subscriber );
    subscribers++;
    instance._start();
  }
  off( subscriber ){
    instance.$dispel( ticEvent , subscriber );
    subscribers--;
  }
  _start(){
    if (!inprog) {
      inprog = true;
      util.$_reqAFrame(function tic( timestamp ){
        instance.$emit( ticEvent , timestamp );
        if (!subscribers) {
          inprog = false;
        }
        if (inprog) {
          util.$_reqAFrame( tic );
        }
      });
    }
  }
}
