var React = require('react');

var Progress = React.createClass({
	render: function(){
		var progress_elements_style = {
			height: this.props.percent === 100 ? this.props.image_height : false
		};
		var image_url = this.props.image
			? URL.createObjectURL( this.props.image )
			: null;
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