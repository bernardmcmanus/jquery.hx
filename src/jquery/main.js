import * as hx from 'main';
import * as util from 'core/util';
import {
  Properties,
  Methods
} from 'jquery/definitions';
import 'jquery/plugin';
import 'jquery/namespace';

util.each( Properties , function( opts ){
  $.hx.defineProperty( opts );
});

util.each( Methods , function( args ){
  $.hx.defineMethod.apply( $.hx , args );
});

// console.log(hx);
