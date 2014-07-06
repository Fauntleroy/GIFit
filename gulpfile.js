var spawn = require('child_process').spawn;
var path = require('path');
var vinyl_source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var w;
var bundle;

gulp.task( 'compile content.js', function(){
	w = watchify('./src/scripts/content.js');
	w.transform('hbsfy');
	w.transform('lessify');
	bundle = function(){
		return w.bundle()
			.pipe( vinyl_source('content.js') )
			.pipe( gulp.dest('./dist/scripts') );
	};
	w.on( 'update', bundle );
	w.on( 'error', function(){
		console.log('error', arguments);
	})
	return bundle();
});

gulp.task( 'recompile content.js', function(){
	bundle();
});

gulp.task( 'copy static files', function(){
	gulp.src([
		'./src/manifest.json',
		'./src/popup.html',
		'./src/scripts/vendor/**/*'
	], { base: './src' })
		.pipe( gulp.dest('dist') );
});

gulp.task( 'watch css', function(){
	gulp.watch( './src/styles/**/*.{less,css}', ['recompile content.js'] );
});

gulp.task( 'watch static files', function(){
	gulp.watch([
		'./src/manifest.json',
		'./src/popup.html',
		'./src/scripts/vendor/**/*'
	], ['copy static files']);
});

gulp.task( 'default', [
	'compile content.js',
	'copy static files',
	'watch css',
	'watch static files'
]);