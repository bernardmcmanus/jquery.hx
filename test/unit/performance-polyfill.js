window.performance = (function( window , Date ) {


    var PERFORMANCE = 'performance';
    var TIMING = 'timing';
    var NOW = 'now';
    var NAVIGATION_START = 'navigationStart';

    var performance = window[ PERFORMANCE ] || {};
    var timing = performance[ TIMING ] || {};
 
    if (!performance[ NOW ]) {

        var offset = timing[ NAVIGATION_START ] ? timing[ NAVIGATION_START ] : Date[ NOW ]();

        performance[ NOW ] = function() {
            return Date[ NOW ]() - offset;
        };

        performance.polyfill = true;
    }

    return performance;

 
})( window , Date );