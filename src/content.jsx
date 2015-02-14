var React = require('react');

var GifitButton = require('./components/GifitButton.jsx');
var GifitApp = require('./components/GifitApp.jsx');

var toggleApp = function(){
	if( app_shown ){
		GifitApp.hide();
	} else {
		GifitApp.show();
	}
};

var youtube_player_chrome_element = document.querySelector('#player-api .html5-player-chrome');
var youtube_player_controls_element = document.querySelector('#player-api .html5-video-controls');

// We need containers since React.renderComponent annihilates the contents of its target
var gifit_button_container_element = youtube_player_chrome_element.appendChild( document.createElement('div') );
var gifit_app_container_element = youtube_player_controls_element.appendChild( document.createElement('div') );

React.render( <GifitButton onClick={toggleApp} />, gifit_button_container_element );
React.render( <GifitApp />, gifit_app_container_element );