module.exports = function( grunt ) {

  var CWD = process.cwd();

  var fs = require( 'fs-extra' );
  var path = require( 'path' );
  var transpiler = require( 'es6-module-transpiler' );
  var Container = transpiler.Container;
  var FileResolver = transpiler.FileResolver;
  var BundleFormatter = transpiler.formatters.bundle;

  grunt.task.registerMultiTask( 'transpile' , 'transpile es6 modules' , function() {
    var that = this;
    var data = grunt.task.normalizeMultiTaskFiles( that.data )[0];
    var options = that.data.options || {};

    var src = path.resolve( CWD , data.orig.src[0] , '../..' );
    var dest = path.join( CWD , data.dest );
    var umd = path.join( CWD , data.umd );

    // inject these globals into closure for better minification
    var injectArgs = options.inject || [];
    var leadingInjectArgs = injectArgs.map(function( arg ) {
      return Array.isArray( arg ) ? arg.shift() : arg;
    });
    var trailingInjectArgs = injectArgs.map(function( arg ) {
      return Array.isArray( arg ) ? arg.pop() : arg;
    });

    var container = new Container({
      resolvers: [new FileResolver([ src ])],
      formatter: new BundleFormatter()
    });

    fs.ensureDirSync( path.dirname( dest ));
    container.getModule( umd );
    container.write( dest );

    var transpiled = fs.readFileSync( dest , 'utf-8' );

    // remove sourceMappingURL
    var sourceMapRegex = /^\n?.*sourceMappingURL.*/mi;
    transpiled = transpiled.replace( sourceMapRegex , '' );

    // add injection args to leading anonymous wrapper
    var leadingWrapperRegex = /\(function\(\)\s?{/;
    transpiled = transpiled.replace( leadingWrapperRegex , '(function(' + leadingInjectArgs + ') {' );

    // replace trailing "call" with "apply" and injection args
    var trailingWrapperRegex = /\.call\(this\)\;(?:\n+)$/;
    transpiled = transpiled.replace( trailingWrapperRegex , '.apply(this,[' + trailingInjectArgs + ']);' );

    fs.writeFileSync( dest , transpiled );
  });

};
















