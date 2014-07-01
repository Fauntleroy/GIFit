var youtube_video = document.querySelector('video.video-stream');
var canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style['z-index'] = 2147483647;
canvas.width = 320;
canvas.height = ( canvas.width * parseInt( youtube_video.style.height, 10 ) ) / parseInt( youtube_video.style.width, 10 );
var context = canvas.getContext('2d');

document.body.appendChild( canvas );

var gif;
var capture_interval;

var startCapture = function( options ){
    if( options.width ){
        canvas.width = options.width || 320;
        canvas.height = ( canvas.width * parseInt( youtube_video.style.height, 10 ) ) / parseInt( youtube_video.style.width, 10 );
    }
    var frame_delay = 1000 / ( options.framerate || 10 );
    gif = new GIF({
        workers: 8,
        quality: options.quality || 5,
        repeat: 0,
        workerScript: chrome.runtime.getURL('vendor/gif.worker.js')
    });
    gif.on( 'finished', function( blob ){
        window.open( URL.createObjectURL( blob ) );
    });
    capture_interval = setInterval( function(){
        context.drawImage( youtube_video, 0, 0, canvas.width, canvas.height );
        gif.addFrame( canvas, {
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
