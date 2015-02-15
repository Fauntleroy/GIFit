var React = require('react');

var gifit_events = require('../utils/gifit_events.js');

var GifitButton = React.createClass({
	render: function(){
		return (
			<div
				className="gifit-button gifit-logo"
				role="button"
				onClick={this._onClick}
			>
				<span className="gifit-logo__gif">GIF</span><span className="gifit-logo__it">it!</span>
			</div>
		);
	},
	_onClick: function( event ){
		event.preventDefault();
		gifit_events.emit('toggle');
	}
});

module.exports = GifitButton;