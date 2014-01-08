(function( hx ) {

    var cdn = function() {
        $.extend( this , {
            key: null,
            manifest: 'http://bmcmanus.cs.sandbox.millennialmedia.com/jquery.hx/cdn/manifest/',
            components: []
        });
    };

    cdn.prototype = {
        setKey: function( key ) {
            this.key = key;
        },
        setManifestPath: function( url ) {
            this.manifest = url;
        },
        load: function( component , callback ) {

            if (!this.key || this.components.indexOf( component ) >= 0)
                return;

            this.components.push( component );

            callback = callback || function() {};

            var params = {
                request: {
                    key: this.key,
                    component: component
                }
            };
            
            var request = $.ajax({
                url: this.manifest + _r(),
                dataType: 'jsonp',
                data: params
            });

            request.done( _loadAssets );
        }
    };

    function _r() {
        return '?r=' + Math.round(new Date().getTime() / 1000);
    }

    function _loadHTML( path , callback ) {
        
        path += _r();
        callback = callback || function() {};

        var request = $.ajax({
            url: path,
            dataType: 'jsonp'
        });

        request.done(function( xhr ) {
            $('body').append( xhr.document );
            callback();
        });
    }

    function _loadCSS( path , callback ) {

        callback = callback || function() {};
        path += _r();

        var style = document.createElement('link');

        style.onload = callback;

        style.setAttribute( 'rel' , 'stylesheet' );
        style.setAttribute( 'type' , 'text/css' );
        style.setAttribute( 'href' , path );

        $('head').prepend( style );
    }

    function _loadJS( path , callback ) {
        path += _r();
        callback = callback || function() {};
        $.getScript( path , callback );
    }

    function _loadAssets( xhr ) {
            
        if (xhr.status !== 'success')
            return;

        var flow = new hx.workflow();

        function html() {
            _loadHTML( xhr.base + xhr.html , function() {
                flow.progress();
            });
        }

        function css() {
            _loadCSS( xhr.base + xhr.css , function() {
                flow.progress();
            });
        }

        function js() {
            _loadJS( xhr.base + xhr.js , function() {
                flow.progress();
            });
        }

        if (xhr.html)
            flow.add( html );

        if (xhr.css)
            flow.add( css );

        if (xhr.js)
            flow.add( js );

        flow.run();
    }

    $.extend( hx , {cdn: new cdn()} );
    
}( hxManager ));



























