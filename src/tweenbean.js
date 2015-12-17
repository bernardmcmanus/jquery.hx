import Wee$ from 'wee-money';
import { $_ensure, $_extend } from 'core/util';
import { Easing } from 'main';

export default class Tweenbean extends Wee$ {
  constructor( property , duration , easeFn ){
    super();
    var that = this;
    that.pct = 0;
    that.elapsed = 0;
    that.duration = $_ensure( duration , 0 );
    that.easeFn = $_ensure( easeFn , Easing.ease.get );
    that.tweenFn = function( pct ){
      property.at( pct );
    };
  }
}
