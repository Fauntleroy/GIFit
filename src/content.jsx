// automatically inject CSS
require('./styles/content.less');

var React = require('react');

var gifit_events = require('./utils/gifit_events.js');
var GifitButton = require('./components/gifit-button.jsx');
var GifitApp = require('./components/gifit-app.jsx');

var initializeGifit = function( youtube_player_api_element ){

	var is_2015_player = !!youtube_player_api_element.querySelector(':scope .ytp-chrome-controls');
	var is_2018_player = !!document.querySelector('#movie_player');

	// Find YouTube elements we'll be injecting into
	var youtube_player_chrome_element = youtube_player_api_element.querySelector(':scope .html5-player-chrome, :scope .ytp-chrome-bottom');
	var youtube_player_controls_element = youtube_player_api_element.querySelector(':scope .html5-video-controls, :scope .ytp-chrome-controls');
	var youtube_player_video_element = youtube_player_api_element.querySelector(':scope video');

	// If GIFit can't find the appropriate elements it does not start
	if( !youtube_player_chrome_element || !youtube_player_controls_element || !youtube_player_video_element ){
		return;
	}

	// GIFit needs containers since React.renderComponent annihilates the contents of its target
	var gifit_button_container_element = document.createElement('div');
	gifit_button_container_element.classList.add('ytp-button', 'ytp-button-gif');
	var gifit_app_container_element = document.createElement('div');
	if( is_2015_player ){
		youtube_player_controls_element.appendChild( gifit_button_container_element );
	} else {
		youtube_player_chrome_element.appendChild( gifit_button_container_element );
	}
	youtube_player_controls_element.appendChild( gifit_app_container_element );

	// Highlight GIFit toolbar button when active
	var gifit_button_active = false;
	gifit_events.on( 'toggle', function(){
		gifit_button_active = !gifit_button_active;
		if( gifit_button_active ){
			youtube_player_api_element.classList.add('gifit--active');
		} else {
			youtube_player_api_element.classList.remove('gifit--active');
		}
	});

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
	youtube_player_api_element.classList.add('gifit--initialized');

	// If it's the 2015 player, add modifier class
	if( is_2015_player ){
		youtube_player_api_element.classList.add('gifit-ytp-2015');
	}
};

// Scan the page for YouTube players
// Inject GIFit into all players found
// This is super nasty but it's the least brittle way to do things. C'est la vie.
var scanPage = function(){
	var youtube_player_api_elements = document.querySelectorAll('#player-api:not(.gifit--initialized), #movie_player:not(.gifit--initialized)');
	for( var i = 0; i < youtube_player_api_elements.length; i ++ ){
		initializeGifit( youtube_player_api_elements[i] );
	}
};

scanPage();
setInterval( scanPage, 1000 );
console.log('test 2');
