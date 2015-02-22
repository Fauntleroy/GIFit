var fs = require('fs');
var test = require('tape');

var GifService = require('../../src/services/GifService.js');

var gif_configuration = {
	start: 0,
	end: 1,
	width: 320,
	height: 180,
	framerate: 10,
	quality: 5
};
var video_element;

// Include a video source the really hard way.
test( 'Setup video', function( t ){
	var video_base64 = fs.readFileSync( __dirname +'/../_fixtures/basara_eats_a_leaf.webm', 'base64' );
	video_element = document.createElement('video');
	video_element.src = 'data:video/webm;base64,'+ video_base64;
	video_element.addEventListener( 'loadeddata', function(){
		t.end();
	});
});

test( 'Creates GIFs from videos', function( t ){
	t.plan(3);
	var gif_service = new GifService();
	gif_service.createGif( gif_configuration, video_element );
	gif_service.on( 'complete', function( image ){
		t.ok( image.blob instanceof Blob, 'gif_service emits "complete" event with image blob' );
	});
	gif_service.once( 'progress', function( status, percent ){
		t.ok( typeof status === 'string', 'gif_service emits "progress" event with status string' );
		t.ok( typeof percent === 'number', 'gif_service emits "progress" event with percent as a number' );
	});
});

test( 'Aborts GIF creation', function( t ){
	t.plan(1);
	var gif_service = new GifService();
	gif_service.createGif( gif_configuration, video_element );
	gif_service.on( 'abort', function(){
		t.pass( 'gif_service emits "abort" event');
	});
	gif_service.abort();
});