// automatically inject CSS
require('../styles/content.less');

// third party modules
var gifjs = require('gif.js');
var $ = window.jQuery = window.$ = require('jquery');
var velocity = require('velocity-animate');
require('./vendor/velocity.ui.js');
var getFormData = require('./vendor/getFormData.js');
var toSeconds = require('./vendor/toSeconds.js');

// templates
var gifit_button_template = require('../templates/button.hbs');
var gifit_options_template = require('../templates/options.hbs');

const MAXIMUM_Z_INDEX = 2147483647;

// get DOM selections sorted
var $window = $(window);
var $body = $('body');
var $youtube_player_api = $('#player-api');
var $youtube_video_container = $youtube_player_api.find('.html5-video-container');
var $youtube_video = $youtube_player_api.find('video.video-stream');
var youtube_video = $youtube_video.get(0);
var $youtube_controls = $youtube_player_api.find('.html5-video-controls .html5-player-chrome');
var $gifit_button = $( gifit_button_template() );
var $gifit_canvas = $('<canvas id="gifit-canvas"></canvas>');
var gifit_canvas_context = $gifit_canvas.get(0).getContext('2d');
var $gifit_options = $( gifit_options_template() );
var $gifit_options_form = $gifit_options.children('form');

$youtube_controls.append( $gifit_button );
$body.append( $gifit_options );
$body.append( $gifit_canvas );

var gif;
var capture_interval;

var generateGIF = function( options ){
    // generate GIF options
    var defaults = {
        width: 320,
        colors: 128,
        framerate: 10,
        quality: 5
    };
    options = $.extend( defaults, options );
    options.frame_interval = 1000 / options.framerate;
    options.start = toSeconds( options.start );
    options.end = toSeconds( options.end );
    options.height = Math.ceil( ( options.width * $youtube_video.height() ) / $youtube_video.width() );
    // create GIF encoder
    gif = new gifjs.GIF({
        workers: 8,
        quality: options.quality,
        repeat: 0,
        width: options.width,
        height: options.height,
        workerScript: chrome.runtime.getURL('scripts/vendor/gif.worker.js')
    });
    gif.on( 'finished', function( blob ){
        $gifit_options_form.find('input, button').prop( 'disabled', false );
        window.open( URL.createObjectURL( blob ) );
    });
    // make sure the video is paused before we jump frames
    if( !youtube_video.paused ){
        youtube_video.pause();
    }
    // prepare canvas for receiving frames
    $gifit_canvas
        .attr( 'width', options.width )
        .attr( 'height', options.height );
    // play the part of the video we want to convert
    youtube_video.currentTime = options.start;
    youtube_video.play();
    var addFrameInterval = setInterval( function(){
        if( youtube_video.currentTime >= options.end ){
            // render the GIF
            gif.render();
            youtube_video.pause();
            clearInterval( addFrameInterval );
            return;
        }
        gifit_canvas_context.drawImage( youtube_video, 0, 0, options.width, options.height );
        gif.addFrame( $gifit_canvas.get(0), {
            delay: options.frame_interval,
            copy: true
        });
    }, options.frame_interval );
};

var setPopupPosition = function(){
    var offset = $gifit_button.offset();
    $gifit_options.css({
        top: offset.top,
        left: offset.left
    });
};

$window.resize( function(){
    setPopupPosition();
});

$gifit_button.on( 'click', function( e ){
    $body.toggleClass('gifit-active');
    if( $gifit_options.is(':visible') ){
        $gifit_options.velocity( 'transition.slideDownOut', 200 );
        $gifit_options.find('fieldset, .actions').velocity({
            opacity: 0
        }, 0 );
    }
    else {
        setPopupPosition();
        $gifit_options.velocity( 'transition.slideUpIn', 200 );
        $gifit_options.find('fieldset, .actions').velocity( 'transition.slideUpIn', { stagger: 35 }, 75 );
    }
});

$gifit_options_form.on( 'submit', function( e ){
    e.preventDefault();
    var options = getFormData( $gifit_options_form.get(0) );
    generateGIF( options );
    $gifit_options_form.find('input, button').prop( 'disabled', true );
});