export default (function() {

	var subscribers = 0;
	var inprog = false;
	var requestAnimationFrame = window.requestAnimationFrame;

	var $timer = E$({
		on: function( handler ) {
			$timer.$when( 'tic' , handler );
			subscribers++;
			start();
		},
		off: function( handler ) {
			$timer.$dispel( 'tic' , handler );
			subscribers--;
		}
	});

	function start() {
		if (!inprog) {
			inprog = true;
			requestAnimationFrame(function tic() {
				$timer.$emit( 'tic' );
				if (!subscribers) {
					inprog = false;
				}
				else if (inprog) {
					requestAnimationFrame( tic );
				}
			});
		}
	}

	return $timer;

}());
