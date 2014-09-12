(function( window ) {
    
    
    var config = {
        fallbackTO: 1500
    };


    var require = function() {

        $.extend( this , {
            manifest: null,
            components: []
        });
    };


    require.prototype = {
        
        setManifestPath: function( url ) {
            this.manifest = url;
        },

        load: function( component , callback ) {

            if (!this.manifest || this.components.indexOf( component ) >= 0) {
                return;
            }

            this.components.push( component );

            callback = callback || function() {};
            
            var request = $.ajax({
                url: this.manifest + _r(),
                dataType: 'json'
            });

            request.done(function( xhr , status ) {

                if (status !== 'success') {
                    return;
                }

                _loadAssets( this , xhr , component , callback );
            }.bind( this ));
        }
    };
    

    function _r() {
        return '?r=' + Math.round(new Date().getTime() / 1000);
    }
    
    
    function isAndroid() {
        return (/android/i).test( navigator.userAgent ) === true;
    }
    

    function _loadAssets( instance , xhr , component , callback ) {

        var complete = 0;

        function checkComplete( expected , action ) {
            complete++;
            if (complete === expected) {
                action();
            }
        }

        function html() {

            complete = 0;

            if (xhr[component].html) {
                
                var packingList = Array.isArray( xhr[component].html ) ? xhr[component].html : [xhr[component].html];
                packingList.forEach(function( src ) {
                    _loadHTML( xhr.base + src , function() {
                        checkComplete( packingList.length , css );
                    });
                });
            }
            else {
                css();
            }
        }

        function css() {

            complete = 0;

            if (xhr[component].css) {

                var packingList = Array.isArray( xhr[component].css ) ? xhr[component].css : [xhr[component].css];
                packingList.forEach(function( src ) {
                    _loadCSS( xhr.base + src , function() {
                        checkComplete( packingList.length , js );
                    });
                });
            }
            else {
                js();
            }
        }

        function js() {

            complete = 0;

            if (xhr[component].js) {

                var packingList = Array.isArray( xhr[component].js ) ? xhr[component].js : [xhr[component].js];
                packingList.forEach(function( src ) {
                    _loadJS( instance , xhr , src , function() {
                        checkComplete( packingList.length , callback );
                    });
                });
            }
            else {
                callback();
            }
        }

        html();
    }
    

    function _loadHTML( src , callback ) {
        
        src += _r();
        callback = callback || function() {};

        var request = $.ajax({
            url: src,
            dataType: 'jsonp'
        });

        request.done(function( xhr ) {
            $('body').append( xhr.document );
            callback();
        });
    }
    

    function _loadCSS( src , callback ) {

        callback = callback || function() {};
        src += _r();

        var style = document.createElement( 'link' );

        style.onload = function() {
            clearTimeout( fallback );
            callback();
        };
        
        var fallback = setTimeout(function() {
            style.onload = function() {};
            callback();
        }, config.fallbackTO );

        style.setAttribute( 'rel' , 'stylesheet' );
        style.setAttribute( 'type' , 'text/css' );
        style.setAttribute( 'href' , src );
        
        var head = document.querySelector( 'head' );
        head.insertBefore( style , head.firstChild );
    }

    function _loadJS( instance , xhr , src , callback ) {

        function load( path ) {

            path += _r();
            callback = callback || function() {};
            
            if (isAndroid()) {
                _getScript( path , callback );
            }
            else {
                $.getScript( path , callback );
            }
        }

        if (typeof src === 'object') {
            src.require = Array.isArray( src.require ) ? src.require : [src.require];
            _loadRequired( instance , xhr , src.require , function() {
                load( xhr.base + src.path );
            });
        }
        else {
            load( xhr.base + src );
        }
    }


    function _loadRequired( instance , xhr , packingList , callback ) {

        callback = callback || function() {};
        var complete = 0;

        function checkComplete( expected , action ) {
            complete++;
            if (complete === expected) {
                action();
            }
        }

        packingList.forEach(function( component ) {

            var require = xhr.Require[component];

            if (typeof window[require.check] !== 'undefined' || instance.components.indexOf( require.check ) >= 0) {
                checkComplete( packingList.length , callback );
            }
            else {
                instance.components.push( require.check );
                _loadJS( instance , xhr , require.path , function() {
                    checkComplete( packingList.length , callback );
                });
            }

        });
    }
    
    
    function _getScript( path , callback ) {
        
        var head = document.querySelector( 'head' );
        var script = document.createElement( 'script' );
        
        script.type = 'text/javascript';
        script.src = path;
        script.onload = callback;
        
        head.insertBefore( script , head.firstChild );
    }


    window.Require = new require();

    
}( window ));



























