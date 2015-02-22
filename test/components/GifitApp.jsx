var fs = require('fs');
var test = require('tape');
var smock = require('simple-mock');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var gifit_events = require('../../src/utils/gifit_events.js');
var GifitApp = require('../../src/components/GifitApp.jsx');

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

test( 'GifitApp toggles activity state', function( t ){
	t.plan(3);
	var gifit_app = TestUtils.renderIntoDocument( <GifitApp video={video_element} /> );
	t.notOk( gifit_app.state.active, 'GifitApp starts inactive' );
	gifit_events.emit('toggle');
	t.ok( gifit_app.state.active, 'GifitApp toggles to active' );
	gifit_events.emit('toggle');
	t.notOk( gifit_app.state.active, 'GifitApp toggles to inactive' );
});

test( 'GifitApp properly sets status classes', function( t ){
	t.plan(8);
	var gifit_app = TestUtils.renderIntoDocument( <GifitApp video={video_element} /> );
	var gifit_app_element = TestUtils.findRenderedDOMComponentWithClass( gifit_app, 'gifit-app' );
	var classes = gifit_app_element.props.className;
	t.notOk( /\bgifit-app--active\b/.test( classes ), 'does not set active class when inactive' );
	t.ok( /\bgifit-app--inactive\b/.test( classes ), 'sets inactive class when inactive' );
	t.notOk( /\bgifit-app--status-generating\b/.test( classes ), 'does not set generating class if no progress' );
	t.notOk( /\bgifit-app--status-generated\b/.test( classes ), 'does not set generated class if no image' );
	gifit_app.setState({
		active: true,
		progress: {
			percent: 50
		},
		image: {}
	});
	classes = gifit_app_element.props.className; // "refresh" shortcut variable
	t.ok( /\bgifit-app--active\b/.test( classes ), 'sets active class when active' );
	t.notOk( /\bgifit-app--inactive\b/.test( classes ), 'does not set inactive class when active' );
	t.ok( /\bgifit-app--status-generating\b/.test( classes ), 'sets generating class if progress' );
	t.ok( /\bgifit-app--status-generated\b/.test( classes ), 'sets generated class if image' );
});

test( 'GifitApp creates a GIF when configuration is submitted', function( t ){
	t.plan(5);
	var gifit_app = TestUtils.renderIntoDocument( <GifitApp video={video_element} /> );
	var createGifMock = smock.mock( gifit_app._gif_service, 'createGif', function(){} );
	var test_config = {
		width: 320,
		start: '0:00',
		end: '0:01'
	};
	gifit_app._onConfigurationSubmit( test_config );
	t.ok( createGifMock.called, 'calls GifService createGif' );
	t.equal( createGifMock.lastCall.args[0].width, test_config.width, 'calls createGif with config width' );
	t.equal( createGifMock.lastCall.args[0].start, 0, 'calls createGif with parsed config start' );
	t.equal( createGifMock.lastCall.args[0].end, 1000, 'calls createGif with parsed config end' );
	t.equal( createGifMock.lastCall.args[1], gifit_app._video_element, 'calls createGif with video element' );
});

test( 'GifitApp resets progress', function( t ){
	t.plan(6);
	var gifit_app = TestUtils.renderIntoDocument( <GifitApp video={video_element} /> );
	t.equal( gifit_app.state.image, null, 'starts with null image' );
	t.equal( gifit_app.state.progress.status, null, 'starts with null status message' );
	t.equal( gifit_app.state.progress.percent, 0, 'starts with 0 progress percent' );
	var test_state = {
		image: {},
		progress: {
			status: 'Testing',
			percent: 50
		}
	};
	gifit_app.setState( test_state );
	gifit_app.cleanProgressState();
	t.equal( gifit_app.state.image, null, 'resets to null image' );
	t.equal( gifit_app.state.progress.status, null, 'resets to null status message' );
	t.equal( gifit_app.state.progress.percent, 0, 'resets to 0 progress percent' );
});