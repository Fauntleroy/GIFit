require('../styles/content.less');
var gifjs = require('gif.js');
var $ = require('jquery');
var gifit_button_template = require('../templates/button.hbs');
var gifit_overlay_template = require('../templates/overlay.hbs');
var gifit_options_template = require('../templates/options.hbs');

const MAXIMUM_Z_INDEX = 2147483647;

// get DOM selections sorted
var $body = $('body');
var $youtube_video_container = $('#player-api .html5-video-container');
var $youtube_video = $('#player-api video.video-stream');
var youtube_video = $youtube_video.get(0);
var $youtube_controls = $('#player-api .html5-video-controls .html5-player-chrome');
var $gifit_button = $( gifit_button_template() );
var $gifit_canvas = $('<canvas></canvas>');
var gifit_canvas_context = $gifit_canvas.get(0).getContext('2d');
var $gifit_overlay = $( gifit_overlay_template() );
var $gifit_close = $gifit_overlay.find('#gifit-close');
var $gifit_options = $( gifit_options_template() );

$youtube_controls.append( $gifit_button );
$body.append( $gifit_canvas );
$body.append( $gifit_overlay );
$body.append( $gifit_options );

var gif;
var capture_interval;

var startCapture = function( options ){
    if( options.width ){
        $gifit_canvas
            .width( options.width || 320 )
            .height( $gifit_canvas.width() * parseInt( $youtube_video.height(), 10 ) ) / parseInt( $youtube_video.width(), 10 );
    }
    var frame_delay = 1000 / ( options.framerate || 10 );
    gif = new gifjs.GIF({
        workers: 8,
        quality: options.quality || 5,
        repeat: 0,
        workerScript: chrome.runtime.getURL('scripts/vendor/gif.worker.js')
    });
    gif.on( 'finished', function( blob ){
        window.open( URL.createObjectURL( blob ) );
    });
    capture_interval = setInterval( function(){
        gifit_canvas_context.drawImage( $youtube_video.get(0), 0, 0, $gifit_canvas.width(), $gifit_canvas.height() );
        gif.addFrame( $gifit_canvas.get(0), {
            delay: frame_delay,
            copy: true
        });
    }, frame_delay );
    if( youtube_video.paused ){
        youtube_video.play();
    }
};

var endCapture = function(){
    clearInterval( capture_interval );
    gif.render();
    if( !youtube_video.paused ){
        youtube_video.pause();
    }
};

$gifit_button.on( 'click', function( e ){
    console.log('gifit button clicked', arguments);
    youtube_video.pause();
    $body.addClass('gifit-active');
});

$gifit_close.on( 'click', function( e ){
    e.preventDefault();
    $body.removeClass('gifit-active');
});