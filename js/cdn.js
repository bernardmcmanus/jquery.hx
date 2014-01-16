(function( hx ) {

    var cdn = function() {
        $.extend( this , {
            manifest: null,
            components: []
        });
    };

    cdn.prototype = {
        setManifestPath: function( url ) {
            this.manifest = url;
        },
        load: function( component , callback ) {

            if (!this.manifest || this.components.indexOf( component ) >= 0)
                return;

            this.components.push( component );

            callback = callback || function() {};
            
            var request = $.ajax({
                url: this.manifest + _r(),
                dataType: 'json'
            });

            request.done(function( xhr , status ) {
                if (status !== 'success')
                    return;
                _loadAssets( xhr , component , callback );
            });
        }
    };

    function _r() {
        return '?r=' + Math.round(new Date().getTime() / 1000);
    }

    function _loadAssets( xhr , component , callback ) {

        var flow = new hx.workflow();

        function html() {
            _loadHTML( xhr.base + xhr[component].html , function() {
                flow.progress();
            });
        }

        function css() {
            _loadCSS( xhr.base + xhr[component].css , function() {
                flow.progress();
            });
        }

        function js() {
            _loadJS( xhr.base + xhr[component].js , function() {
                flow.progress();
            });
        }

        if (xhr[component].html)
            flow.add( html );

        if (xhr[component].css)
            flow.add( css );

        if (xhr[component].js)
            flow.add( js );

        flow.run();
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

    $.extend( hx , {cdn: new cdn()} );
    
}( hxManager ));



























