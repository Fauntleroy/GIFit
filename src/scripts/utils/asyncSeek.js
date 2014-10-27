var asyncSeek = function( video, time, callback ){
	var doneSeeking = function(){
		video.removeEventListener( 'seeked', doneSeeking );
		if( callback ) callback();
	};
	video.addEventListener( 'seeked', doneSeeking );
	video.currentTime = time;
};

module.exports = asyncSeek;