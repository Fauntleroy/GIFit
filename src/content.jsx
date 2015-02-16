// automatically inject CSS
require('./styles/content.less');

var React = require('react');

var GifitButton = require('./components/GifitButton.jsx');
var GifitApp = require('./components/GifitApp.jsx');

var initializeGifit = function( youtube_player_api_element ){

	// Find YouTube elements we'll be injecting into
	var youtube_player_chrome_element = youtube_player_api_element.querySelector(':scope .html5-player-chrome');
	var youtube_player_controls_element = youtube_player_api_element.querySelector(':scope .html5-video-controls');
	var youtube_player_video_element = youtube_player_api_element.querySelector(':scope video');

	// If GIFit can't find the appropriate elements it does not start
	if( !youtube_player_controls_element || !youtube_player_chrome_element ){
		return;
	}

	// GIFit needs containers since React.renderComponent annihilates the contents of its target
	var gifit_button_container_element = document.createElement('div');
	gifit_button_container_element.classList.add('ytp-button', 'ytp-button-gif');
	var gifit_app_container_element = document.createElement('div');
	youtube_player_chrome_element.appendChild( gifit_button_container_element );
	youtube_player_controls_element.appendChild( gifit_app_container_element );

	// Prevent YouTube's events from firing in GIFit's interface
	var stopImmediatePropagation = function( event ){
		event.stopImmediatePropagation();
	};
	gifit_app_container_element.addEventListener( 'keydown', stopImmediatePropagation );
	gifit_app_container_element.addEventListener( 'keypress', stopImmediatePropagation );
	gifit_app_container_element.addEventListener( 'contextmenu', stopImmediatePropagation );

	// Engage party mode
	React.render( <GifitButton />, gifit_button_container_element );
	React.render( <GifitApp video={youtube_player_video_element} />, gifit_app_container_element );

	// Mark territory
	youtube_player_api_element.classList.add('gifit-initialized');
};

// Scan the page for YouTube players
// Inject GIFit into all players found
// This is super nasty but it's the least brittle way to do things. C'est la vie.
var scanPage = function(){
	var youtube_player_api_elements = document.querySelectorAll('#player-api:not(.gifit-initialized)');
	for( var i = 0; i < youtube_player_api_elements.length; i ++ ){
		initializeGifit( youtube_player_api_elements[i] );
	}
};

scanPage();
setInterval( scanPage, 1000 );