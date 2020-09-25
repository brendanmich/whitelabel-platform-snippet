// MIT LICENSE

/**
 * Requires
 */

// CSS
require('foundation-sites/dist/css/foundation.css');
require('../../css/app.css');

// Javascript
const jQuery = require('jquery');
require('regenerator-runtime/runtime');
require('foundation-sites');

// Set Globals
window.$ = jQuery;
window.jQuery = jQuery;

/**
 * Init
 */

// Initialize Foundation
$(document).foundation();

// Activate post-load features
$(document).ready(() => {
	$('body').removeClass('preload');
});

/**
 * Handlers
 */

// Remove hash from URL
$(document).ready(() => {
	const urlString = window.location.toString();
	if (urlString.indexOf('#') !== -1) {
		const newurlString = urlString.split('#')[0];
		if (urlString.split('#')[1] === 'top' || urlString.split('#')[1] === '') {
			window.history.pushState(null, '', newurlString);
		}
	}
});

// Enable smooth scroll
const $root = $('html, body');
$('a').click(function () {
	if ($(this).attr('href') && $(this).attr('href').match('^/#')) {
		if (window.location.pathname === '/') {
			$root.animate({
				scrollTop: $($(this).attr('href').substring(1)).offset().top
			}, 500);
		} else {
			window.location = $(this).attr('href');
		}
		return false;
	} if ($(this).attr('href') && $(this).attr('href').indexOf('#') > -1) {
		const tag = $(this).attr('href').split('#').pop();
		if (tag !== '') {
			$root.animate({
				scrollTop: $(`#${tag}`).offset().top
			}, 500);
			return false;
		}
	}
	return undefined;
});
