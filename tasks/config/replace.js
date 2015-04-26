module.exports = function( grunt ) {

  function options( replacements ) {
    replacements = replacements || {};
    return {
      patterns: [{
        match: /#\{([^\{\}]*)\}/g,
        replacement: function( match , group ) {
          var replacement = replacements[group] !== undefined ? replacements[group] : '';
          var value = (typeof replacement == 'function' ? replacement( match , group ) : replacement);
          return grunt.config.process( value || '' );
        }
      }]
    };
  }

  return function( config ) {
    return {
      options: options( config.replacements ),
      files: config.files
    };
  };
};
