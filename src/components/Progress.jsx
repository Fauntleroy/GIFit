var React = require('react');

var DEFAULT_IMAGE_DISPLAY_WIDTH = 240;

var Progress = React.createClass({
	render: function(){
		if( this.props.image ){
			// Prepare a height proportional to the width the image will be displayed at
			// nasty but necessary for the effect at the end of GIF creation
			var image_display_height = DEFAULT_IMAGE_DISPLAY_WIDTH * ( this.props.image.height / this.props.image.width );
			var image_url = URL.createObjectURL( this.props.image.blob );
			var progress_elements_style = {
				height: image_display_height
			};
		}
		return (
			<div className="gifit-progress">
				<a
					className="gifit-progress__close"
					onClick={this._onCloseClick}
				></a>
				<div className="gifit-progress__details">
					<div className="gifit-progress__status">{this.props.status}</div>
					<div className="gifit-progress__elements" style={progress_elements_style}>
						<progress
							className="gifit-progress__progress"
							value={this.props.percent}
							max="100"
						></progress>
						<img className="gifit-progress__result" src={image_url} />
					</div>
				</div>
			</div>
		)
	},
	_onCloseClick: function( event ){
		event.preventDefault();
		this.props.onCloseClick();
	}
});

module.exports = Progress;