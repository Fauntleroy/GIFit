var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var gifit_events = require('../../src/utils/gifit_events.js');
var GifitButton = require('../../src/components/GifitButton.jsx');

test( 'GifitButton emits "toggle" event when clicked', function( t ){
	t.plan(1);
	var gifit_button = TestUtils.renderIntoDocument( <GifitButton /> );
	var gifit_button_div_element = TestUtils.findRenderedDOMComponentWithClass( gifit_button, 'gifit-button' );
	gifit_events.once( 'toggle', function(){
		t.pass('emits "toggle" event');
	});
	TestUtils.Simulate.click( gifit_button_div_element );
});