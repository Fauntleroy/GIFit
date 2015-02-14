var React = require('react');

var GifitButton = React.createClass({
	render: function(){
		return (
			<div
				id="gifit-start"
				className="gifit-button gifit-logo ytp-button ytp-button-gif"
				role="button"
				onClick={this._onclick}
			>
				<span className="gifit-logo__gif">GIF</span><span className="gifit-logo__it">it!</span>
			</div>
		);
	},
	_onClick: function( event ){
		event.preventDefault();
		this.props.onClick();
	}
});

module.exports = GifitButton;