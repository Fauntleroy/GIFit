console.log('it works!');
console.log('GIF',GIF);

var youtube_video = document.querySelector('video.video-stream');
var canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style['z-index'] = 2147483647;
canvas.width = 300;
canvas.height = 169;
var context = canvas.getContext('2d');

document.body.appendChild( canvas );

function draw(v, c, w, h) {
    // if(v.paused || v.ended)  return false;
    console.log("draw event entered");
    c.drawImage(v, 0, 0, w, h);
    setTimeout(draw, 20, v, c, w, h);
};

draw( youtube_video, context, canvas.width, canvas.height );

var gif;
var capture_interval;

var startCapture = function(){
    gif = new GIF({
        workers: 2,
        quality: 5,
        repeat: 0,
        workerScript: chrome.runtime.getURL('vendor/gif.worker.js')
    });
    gif.on( 'finished', function( blob ){
        window.open( URL.createObjectURL( blob ) );
    });
    capture_interval = setInterval( function(){
        gif.addFrame( canvas, {
            delay: 100,
            copy: true
        });
    }, 100 );
};

var endCapture = function(){
    clearInterval( capture_interval );
    gif.render();
};

youtube_video.addEventListener( 'play', function(){
    startCapture();
});

youtube_video.addEventListener( 'pause', function(){
    endCapture();
});
