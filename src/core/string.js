import * as util from 'core/util';

export function interpret( subject ){
  var matches = subject.match(getRegExp( 'g' )),
    regexp = getRegExp(),
    context = {};
  util.each( matches , function( key ){
    key = util.ensure( key.match( regexp ), [] )[1];
    context[key] = context[key]; // undefined
  });
  return context;
}

export function compile( subject , context ){
  return subject.replace(getRegExp( 'g' ), function( match , group ){
    return context[group];
  });
}

function getRegExp( modifiers ){
  return new RegExp( '\\$\\{([^\\$\\{\\}\\:\\"]+)\\}' , modifiers );
}
