(function( hx ) {

    var workflow = function( options ) {

        options = $.extend({
            queue: [],
            count: 0,
            index: 0,
            debug: false
        }, (options || {}));

        $.extend( this , options );

        this._init();
    };

    workflow.prototype = {
        _init: function() {
            this.count = this.queue.length;
        },
        _valid: function( task ) {
            if (typeof task !== 'function')
                throw 'only functions can be queued in the workflow.';
        },
        add: function( task , context ) {
            
            context = context || task;
            this._valid( task );
            
            var wfTask = function( args ) {
                task.apply( context , args );
            };
            
            this.queue.push( wfTask );
            this.count++;
        },
        wait: function( t ) {
                        
            var wfTask = function( args ) {
                var a = new Date().getTime();
                var b = 0;
                while (b - a < t) {
                    b = new Date().getTime();
                }
                this.progress.apply( this , args );
            };
            
            this.queue.push( wfTask );
            this.count++;
        },
        run: function() {
            this._doWork( this.index , this.count , arguments );
        },
        progress: function() {
            if (this.debug)
                hxManager.log('completed task ' + this.index);
            this.index++;
            this._doWork( this.index , this.count , arguments );
        },
        _doWork: function( i , c , args ) {
            if (i < c) {
                this.queue[ i ].call( this , args );
            } else {
                if (this.debug)
                    hxManager.log('workflow complete');
            }
        }
    };

    $.extend( hx , {workflow: workflow} );
    
}( hxManager ));



























