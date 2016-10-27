const $ = require('jquery');

module.exports = function() {
	window.jQuery = window.$ = $;
	require('hx');
};
