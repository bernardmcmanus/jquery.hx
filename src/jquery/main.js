import * as util from 'core/util';
import {
  Properties,
  Methods
} from 'jquery/definitions';
import 'jquery/plugin';
import 'jquery/namespace';

util.$_each( Properties , function( opts ){
  $.hx.defineProperty( opts );
});

util.$_each( Methods , function( args ){
  $.hx.defineMethod.apply( $.hx , args );
});
