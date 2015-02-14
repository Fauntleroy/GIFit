// automatically inject CSS
require('./styles/content.less');

var React = require('react');

var GifitButton = require('./components/GifitButton.jsx');
var GifitApp = require('./components/GifitApp.jsx');

var youtube_player_chrome_element = document.querySelector('#player-api .html5-player-chrome');
var youtube_player_controls_element = document.querySelector('#player-api .html5-video-controls');

// We need containers since React.renderComponent annihilates the contents of its target
var gifit_button_container_element = document.createElement('div');
gifit_button_container_element.classList.add('ytp-button', 'ytp-button-gif');
var gifit_app_container_element = document.createElement('div');
youtube_player_chrome_element.appendChild( gifit_button_container_element );
youtube_player_controls_element.appendChild( gifit_app_container_element );

// Prevent YouTube's events from firing in Gifit's interface
var stopImmediatePropagation = function( event ){
	event.stopImmediatePropagation();
};
gifit_app_container_element.addEventListener( 'keydown', stopImmediatePropagation );
gifit_app_container_element.addEventListener( 'keypress', stopImmediatePropagation );
gifit_app_container_element.addEventListener( 'click', stopImmediatePropagation );
gifit_app_container_element.addEventListener( 'contextmenu', stopImmediatePropagation );

// Emgage party mode
React.render( <GifitButton />, gifit_button_container_element );
React.render( <GifitApp />, gifit_app_container_element );