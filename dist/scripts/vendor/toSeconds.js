var toSeconds = function( time_string ){
	var seconds = 0;
	var time_array = time_string.split(':').reverse();
	for( var i = 0; i < time_array.length; i++ ){
		var time_segment = parseFloat( time_array[i] );
		switch( i ){
			case 0:
				seconds += time_segment;
			break;
			case 1:
				seconds += time_segment * 60;
			break;
			case 2:
				seconds += time_segment * 60 * 60;
			break;
		}
	}
	return seconds;
};

module.exports = toSeconds;