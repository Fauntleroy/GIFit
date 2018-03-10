var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var gifjs_worker = fs.readFileSync( require.resolve('gif.js/dist/gif.worker.js'), 'utf8' );
var gifjs_worker_blob = new Blob( [gifjs_worker], {
	type: 'application/javascript'
});

var GATHERING_FRAMES_STATUS = 'Gathering frames…';
var RENDERING_STATUS = 'Rendering GIF…';

// Return combined progress of frame gathering and GIF rendering as percent
var calculateProgress = function( frame_gathering_progress, rendering_progress ){
	return (( frame_gathering_progress * 0.7 ) + ( rendering_progress * 0.3 )) * 100;
};

// Determine which state string is current
var getStatus = function( frame_gathering_progress ){
	var status = '';
	if( frame_gathering_progress < 1 ){
		status = GATHERING_FRAMES_STATUS;
	} else {
		status = RENDERING_STATUS;
	}
	return status;
};

// Seek through <video> frames asynchronously
var asyncSeek = function( video, time, callback ){
	var doneSeeking = function(){
		video.removeEventListener( 'seeked', doneSeeking );
		if( callback ) callback();
	};
	video.addEventListener( 'seeked', doneSeeking );
	video.currentTime = time;
};

var GifService = function(){
	EventEmitter.call( this );
	this._gif = null;
	this._aborted = false;
	var canvas_element = this._canvas_element = document.createElement('canvas');
	canvas_element.style.imageRendering = 'crisp-edges';
	var canvas_element_resized = this._canvas_element_resized = document.createElement('canvas');
};

inherits( GifService, EventEmitter );

GifService.prototype.createGif = function( configuration, video_element ){
	var gif_service = this;
	var canvas_element = this._canvas_element;
	var canvas_element_resized = this._canvas_element_resized;
	var context = canvas_element.getContext('2d');
	var context_resized = canvas_element_resized.getContext('2d');
	var frame_gathering_progress = 0;

	// Clear abort token
	this._aborted = false;

	// Process configuration data
	var framerate = configuration.framerate;
	var frame_interval = 1000 / framerate;
	var start = configuration.start;
	var end = configuration.end;
	var width = configuration.width;
	var height = configuration.height;
	var quality = 31 - ( configuration.quality * 3 );
	var gif_duration = configuration.end - configuration.start;
	// To properly indicate progress we need a point of comparison locked to the frame rate
	var true_gif_duration = ( gif_duration - ( gif_duration % frame_interval ) );

	// Prepare canvas
	var video_width = video_element.getBoundingClientRect().width;
	var video_height = video_element.getBoundingClientRect().height;
	canvas_element.setAttribute( 'width', video_width );
	canvas_element.setAttribute( 'height', video_height );
	canvas_element.style.width = width + 'px';
	canvas_element_resized.setAttribute( 'width', width );
	canvas_element_resized.setAttribute( 'height', height );

	// Pause video to prevent crazy audio artifacts
	if( !video_element.paused ){
		video_element.pause();
	}

	// Initialize GIF maker
	var gif = this._gif = new GIF({
		workers: 8,
		quality: quality,
		repeat: 0,
		width: width,
		height: height,
		workerScript: URL.createObjectURL( gifjs_worker_blob )
	});
	gif.on( 'finished', function( image_blob ){
		var image_attributes = {
			blob: image_blob,
			width: width,
			height: height
		};
		gif_service.emit( 'complete', image_attributes );
		gif_service._gif = null;
	});
	gif.on( 'progress', function( progress_ratio ){
		var overall_progress = calculateProgress( frame_gathering_progress, progress_ratio );
		var status = getStatus( frame_gathering_progress );
		gif_service.emit( 'progress', status, overall_progress );
	});

	// Run frames through GIF maker
	asyncSeek( video_element, ( start / 1000 ), function(){
		var addFrame = function(){
			if( gif_service._aborted ) return;
			var current_time = video_element.currentTime * 1000;
			if( current_time > end ){
				// render the GIF
				gif.render();
				return;
			}
			// Draw current frame on canvas, then transfer that to gif.js
			context.drawImage( video_element, 0, 0, video_width, video_height );
			context_resized.drawImage( canvas_element, 0, 0, width, height );
			gif.addFrame( canvas_element_resized, {
				delay: frame_interval,
				dispose: 1,
				copy: true
			});
			frame_gathering_progress = ( current_time - start ) / true_gif_duration;
			var overall_progress = calculateProgress( frame_gathering_progress, 0 );
			var status = getStatus( frame_gathering_progress );
			gif_service.emit( 'progress', status, overall_progress );
			var next_frame_time = current_time + ( 1000 / framerate );
			asyncSeek( video_element, ( next_frame_time / 1000 ), addFrame );
		};
		addFrame();
	});
};

// Stop gathering frames / rendering GIF
GifService.prototype.abort = function(){
	if( !this._gif ){
		return;
	}
	this._aborted = true;
	this._gif.abort();
	this._gif = null;
	this.emit('abort');
};

GifService.prototype.destroy = function(){

};

module.exports = GifService;
