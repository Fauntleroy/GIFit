var spawn = require('child_process').spawn;
var path = require('path');
var vinyl_source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var gulp_less = require('gulp-less');

gulp.task( 'compile css', function(){
	gulp.src('./src/styles/content.less')
		.pipe( gulp_less({
			paths: [ path.join( __dirname, 'src', 'styles' ) ]
		}))
		.pipe( gulp.dest('./dist') );
});

gulp.task( 'compile content.js', function(){
	var w = watchify('./src/scripts/content.js');
	w.transform('hbsfy');
	var bundle = function(){
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

gulp.task( 'compile popup.js', function(){
	var w = watchify('./src/scripts/popup.js');
	w.transform('hbsfy');
	var bundle = function(){
		return w.bundle()
			.pipe( vinyl_source('popup.js') )
			.pipe( gulp.dest('./dist/scripts') );
	};
	w.on( 'update', bundle );
	w.on( 'error', function(){
		console.log('error', arguments);
	})
	return bundle();
});

gulp.task( 'copy static files', function(){
	gulp.src([
		'./src/manifest.json',
		'./src/popup.html',
		'./src/scripts/vendor/**/*',
		'./src/images/**/*'
	], { base: './src' })
		.pipe( gulp.dest('dist') );
});

gulp.task( 'watch css', function(){
	gulp.watch( './src/styles/**/*.{less,css}', ['compile css'] );
});

gulp.task( 'watch static files', function(){
	gulp.watch([
		'./src/manifest.json',
		'./src/popup.html',
		'./src/scripts/vendor/**/*',
		'./src/images/**/*'
	], ['copy static files']);
});

gulp.task( 'default', [
	'compile css',
	'compile content.js',
	'compile popup.js',
	'copy static files',
	'watch css',
	'watch static files'
]);