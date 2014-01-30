(function( hx ) {

    var workflow = function() {

        var config = {
            queue: [],
            count: 0,
            index: 0,
            done: function() {}
        };

        $.extend( this , config );

        this._init();
    };

    workflow.prototype = {
        _init: function() {
            this.count = this.queue.length;
        },
        _valid: function( task ) {
            if (typeof task !== 'function')
                throw 'Error: Only functions can be queued in the workflow.';
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
        run: function(/* arguments , callback */) {
            this._setCallback( arguments );
            this._doWork( this.index , this.count , arguments );
        },
        _setCallback: function( args ) {
            var done = hx.helper.array.last.call( args );
            if (typeof done === 'function')
                this.done = done;
        },
        progress: function() {
            this.index++;
            this._doWork( this.index , this.count , arguments );
        },
        _doWork: function( i , c , args ) {
            if (i < c) {
                this.queue[ i ].call( this , args );
            } else {
                this.done.apply( this , args );
            }
        }
    };

    $.extend( hx , {workflow: workflow} );
    
}( hxManager ));



























