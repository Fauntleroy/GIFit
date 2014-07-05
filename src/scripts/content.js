var gifjs = require('gif.js');
var dq = require('domquery');

const MAXIMUM_Z_INDEX = 2147483647;

var youtube_video_container = dq('#player-api .html5-video-container');
var youtube_video = dq('#player-api video.video-stream');
var youtube_controls = dq('#player-api .html5-video-controls .html5-player-chrome');
var gifit_button = dq('<div class="ytp-button typ-button-gif" role="button">GIF</div>');
var gifit_canvas = dq('<canvas></canvas>');
var gifit_canvas_context = gifit_canvas[0].getContext('2d');
var gifit_overlay = dq('<div style="background:rgba(15,15,15,0.95);position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483447;display:none;"></div>');

youtube_controls.add( gifit_button );
document.body.appendChild( gifit_canvas[0] );
document.body.appendChild( gifit_overlay[0] );

var gif;
var capture_interval;

var startCapture = function( options ){
    if( options.width ){
        gifit_canvas.width = options.width || 320;
        gifit_canvas.height = ( gifit_canvas.width * parseInt( youtube_video.style.height, 10 ) ) / parseInt( youtube_video.style.width, 10 );
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
        gifit_context.drawImage( youtube_video, 0, 0, gifit_canvas.width, gifit_canvas.height );
        gif.addFrame( gifit_canvas, {
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

gifit_button.on( 'click', function( e ){
    console.log('gifit button clicked', arguments);
    youtube_video[0].pause();
    youtube_video_container.style({
        'z-index': MAXIMUM_Z_INDEX - 100,
        '-webkit-filter': 'drop-shadow( 0 50px 75px rgba( 0, 0, 0, 0.9 ) )'
    });
    gifit_overlay.style({
        display: 'block'
    });
});

chrome.runtime.onMessage.addListener( function( request, sender, cb ){
    switch( request.action ){
        case 'record':
            startCapture( request.options );
        break;
        case 'stop':
            endCapture();
        break;
    }
});
