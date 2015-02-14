var React = require('react');

var ConfigurationPanel = React.createClass({
	render: function(){
		return (
			<div className="gifit-configuration">
				<form onSubmit={this._onSubmit}>
					<fieldset className="gifit__fieldset--horizontal">
						<div className="gifit__inputs">
							<label className="gifit__label" for="gifit-option-start">Start</label>
							<input
								id="gifit-option-start"
								className="gifit__input"
								name="start" type="text"
								value={this.props.configuration.start}
							/>
						</div>
						<div className="gifit__inputs">
							<label className="gifit__label" for="gifit-option-end">End</label>
							<input
								id="gifit-option-end"
								className="gifit__input"
								name="end"
								type="text"
								value={this.props.configuration.end}
							/>
						</div>
					</fieldset>
					<fieldset className="gifit__fieldset--horizontal">
						<div className="gifit__inputs">
							<label className="gifit__label" for="gifit-option-width">Width</label>
							<input
								id="gifit-option-width"
								className="gifit__input"
								name="width"
								type="number"
								min="10"
								max="1920"
								value={this.props.configuration.width}
							/>
						</div>
						<div className="gifit__inputs">
							<label className="gifit__label" for="gifit-option-height">Height</label>
							<input 
								id="gifit-option-height"
								className="gifit__input"
								name="height"
								type="number"
								min="10"
								max="1080"
								value={this.props.configuration.height}
							/>
						</div>
					</fieldset>
					<fieldset>
						<div className="gifit__inputs">
							<label className="gifit__label" for="gifit-option-framerate">Frame Rate</label>
							<input
								id="gifit-option-framerate"
								className="gifit__input"
								name="framerate"
								type="number"
								min="1"
								max="60"
								value={this.props.configuration.framerate}
							/>
						</div>
					</fieldset>
					<fieldset>
						<div className="gifit__inputs gifit__inputs--range">
							<label className="gifit__label" for="gifit-option-quality">Quality</label>
							<input
								id="gifit-option-quality"
								className="gifit__input"
								name="quality"
								type="range"
								min="0"
								max="10"
								value={this.props.configuration.quality}
							/>
						</div>
					</fieldset>
					<div className="gifit-configuration__actions">
						<button id="gifit-submit" className="gifit__button gifit__button--primary" type="submit">
							<span className="gifit-logo__gif">GIF</span><span className="gifit-logo__it">it!</span>
						</button>
					</div>
				</form>
			</div>
		);
	},
	_onSubmit: function( event ){
		event.preventDefault();
		this.props.onSubmit( this.state );
	}
});

module.exports = ConfigurationPanel;