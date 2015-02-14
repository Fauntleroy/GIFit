var React = require('react');

var Progress = React.createClass({
	render: function(){
		var image_url = this.props.image
			? URL.createObjectURL( this.props.image )
			: null;
		return (
			<div className="gifit-progress">
				<a className="gifit-progress__close" href="#close"></a>
				<div className="gifit-progress__details">
					<div className="gifit-progress__status">{this.props.status}</div>
					<div className="gifit-progress__elements">
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
	}
});

module.exports = Progress;