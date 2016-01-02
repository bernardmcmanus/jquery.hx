import * as util from 'core/util';

export default class Stack {
  constructor(){
    var that = this;
    that.index = 0;
    that.length = 0;
    that.inprog = false;
  }
  enqueue( element ){
    var that = this;
    that[that.length] = element;
    that.length++;
  }
  empty(){
    var that = this,
      i = that.length;
    while (i --> 0) {
      that.drop( i );
    }
    that.length = that.index = 0;
  }
  drop( index ){
    delete this[index];
  }
  indexOf( subject ){
    var that = this,
      i = that.length;
    while (i --> 0) {
      if (that[i] == subject) {
        break;
      }
    }
    return i;
  }
  next(){
    var that = this,
      element = that[that.index];
    that.drop( that.index );
    that.index++;
    if (that.index >= that.length) {
      that.empty();
    }
    return element;
  }
  flush( cb ){
    var that = this,
      element,
      caught;
    if (!that.inprog) {
      that.inprog = true;
      /* jshint -W084 */
      while (element = that.next()) {
        try {
          cb( element );
        }
        catch( err ){
          caught = err;
          that.empty();
          break;
        }
      }
      that.inprog = false;
      if (caught) {
        throw caught;
      }
    }
  }
}