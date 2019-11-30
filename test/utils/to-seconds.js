var test = require('tape');

var toSeconds = require('../../src/utils/to-seconds.js');

test( 'Converts MM:SS format to seconds integer', function( t ){
	t.plan(5);
	t.equal( toSeconds('00:01'), 1, 'Converts 00:01 seconds' );
	t.equal( toSeconds('00:11'), 11, 'Converts 00:11 to seconds' );
	t.equal( toSeconds('01:11'), 71, 'Converts 01:11 to seconds' );
	t.equal( toSeconds('11:11'), 671, 'Converts 11:11 to seconds' );
	t.equal( toSeconds('11:00'), 660, 'Converts 11:00 to seconds' );
});

test( 'Converts HH:MM:SS format to seconds integer', function( t ){
	t.plan(3);
	t.equal( toSeconds('01:00:00'), 3600, 'Converts 01:00:00 to seconds' );
	t.equal( toSeconds('11:00:00'), 39600, 'Converts 11:00:00 to seconds' );
	t.equal( toSeconds('11:01:01'), 39661, 'Converts 11:01:01 to seconds' );
});

test( 'Converts unformatted number to seconds integer', function( t ){
	t.plan(2);
	t.equal( toSeconds('99'), 99, 'Converts 99 to seconds' );
	t.equal( toSeconds('5'), 5, 'Converts 5 to seconds' );
});