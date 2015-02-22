var fs = require('fs');
var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var findWhere = require('lodash/collection/findWhere');

var ConfigurationPanel = require('../../src/components/ConfigurationPanel.jsx');

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

test( 'ConfigurationPanel updates inputs as they change', function( t ){
	t.plan(2);
	var configuration_panel = TestUtils.renderIntoDocument( <ConfigurationPanel video={video_element} /> );
	var input_elements = TestUtils.scryRenderedDOMComponentsWithTag( configuration_panel, 'input' );
	var input_text_element = findWhere( input_elements, {
		props: {
			name: 'start'
		}
	});
	var input_checkbox_element = findWhere( input_elements, {
		props: {
			name: 'link_dimensions'
		}
	});
 	TestUtils.Simulate.change( input_text_element, {
 		target: {
 			name: 'start',
 			value: '0:01'
 		}
	});
	TestUtils.Simulate.change( input_checkbox_element, {
		target: {
			name: 'link_dimensions',
			checked: false
		}
	});
	t.equal( input_text_element.props.value, '0:01', 'Updates text inputs' );
	t.equal( input_checkbox_element.props.checked, false, 'Updates checkbox inputs' );
});

test( 'ConfigurationPanel triggers "onSubmit" callback when form is submitted', function( t ){
	t.plan(1);
	var onSubmit = function( configuration ){
		t.equal( configuration.start, '0:00', 'Configuration data is passed to onSubmit prop' );
	};
	var configuration_panel = TestUtils.renderIntoDocument( <ConfigurationPanel video={video_element} onSubmit={onSubmit} /> );
	var form_element = TestUtils.findRenderedDOMComponentWithTag( configuration_panel, 'form' );
	TestUtils.Simulate.submit( form_element );
});

test( 'ConfigurationPanel sets GIF dimensions by video aspect ratio', function( t ){
	t.plan(1);
	var configuration_panel = TestUtils.renderIntoDocument( <ConfigurationPanel video={video_element} /> );
	var video_aspect_ratio = video_element.videoWidth / video_element.videoHeight;
	t.equal( configuration_panel.state.aspect_ratio, video_aspect_ratio, 'Sets aspect ratio according to video dimensions' );
});

test( 'ConfigurationPanel automatically seeks to start/end times', function( t ){
	t.plan(2);
	var configuration_panel = TestUtils.renderIntoDocument( <ConfigurationPanel video={video_element} /> );
	var input_elements = TestUtils.scryRenderedDOMComponentsWithTag( configuration_panel, 'input' );
	var input_start_element = findWhere( input_elements, {
		props: {
			name: 'start'
		}
	});
	var input_end_element = findWhere( input_elements, {
		props: {
			name: 'end'
		}
	});
	TestUtils.Simulate.change( input_start_element, {
		target: {
			name: 'start',
			value: '0:02'
		}
	});
	t.equal( video_element.currentTime, 2, 'Automatically seeks video to new start time' );
	TestUtils.Simulate.change( input_end_element, {
		target: {
			name: 'end',
			value: '0:08'
		}
	});
	t.equal( video_element.currentTime, 8, 'Automatically seeks video to new end time' );
});