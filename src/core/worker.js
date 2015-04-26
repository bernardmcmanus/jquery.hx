import $hx from 'main';
import $Class from 'core/class';

export default function $Worker( $className ) {
  var that = $Worker.$new( this );
  that.worker = $hx.multiThread ? new Worker( $hx.src ) : $('<iframe src="about:blank"></iframe>').get( 0 );
  console.log(that.worker);
}

$Class( $$ ).inherits( E$ , {
  _new: function() {
    E$.construct( this );
  },
  send: function() {
    var that = this;
  },
  handleEvent: function( e ) {
    var that = this;
    console.log(e);
  },
  handleE$: function( e , data ) {
    var that = this;
  }
});
