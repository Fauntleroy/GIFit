var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Progress = require('../../src/components/Progress.jsx');

test( 'Progress sets image display height based on image aspect ratio', function( t ){
	t.plan(1);
	var image = {
		width: 320,
		height: 240
	};
	var progress = TestUtils.renderIntoDocument( <Progress image={image} /> );
	var progress_elements_element = TestUtils.findRenderedDOMComponentWithClass( progress, 'gifit-progress__elements' );
	t.equal( progress_elements_element.props.style.height, 180, 'height style attribute is set based on aspect ratio' );
});