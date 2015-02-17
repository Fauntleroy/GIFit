var React = require('react');

var ConfigurationPanel = React.createClass({
	getInitialState: function(){
		return {
			start: '0:00',
			end: '0:01',
			width: 320,
			height: 180,
			link_dimensions: true,
			framerate: 10,
			quality: 5
		};
	},
	componentWillMount: function(){
		this._video_element = this.props.video;
		this._video_element.addEventListener( 'loadeddata', this._onVideoLoad );
	},
	componentWillUnmount: function(){
		this._video_element.removeEventListener( 'loadeddata', this._onVideoLoad );
	},
	render: function(){
		return (
			<div className="gifit-configuration">
				<form onSubmit={this._onSubmit}>
					<fieldset className="gifit__fieldset--horizontal">
						<div className="gifit__inputs">
							<label className="gifit__label" htmlFor="gifit-option-start">Start</label>
							<input
								id="gifit-option-start"
								className="gifit__input"
								name="start"
								type="text"
								value={this.state.start}
								onChange={this._onChange}
							/>
						</div>
						<div className="gifit__inputs">
							<label className="gifit__label" htmlFor="gifit-option-end">End</label>
							<input
								id="gifit-option-end"
								className="gifit__input"
								name="end"
								type="text"
								value={this.state.end}
								onChange={this._onChange}
							/>
						</div>
					</fieldset>
					<fieldset className="gifit__fieldset--horizontal">
						<div className="gifit__inputs">
							<label className="gifit__label" htmlFor="gifit-option-width">Width</label>
							<input
								id="gifit-option-width"
								className="gifit__input"
								name="width"
								type="number"
								min="10"
								max="1920"
								value={this.state.width}
								onChange={this._onChange}
							/>
						</div>
						<input
							className="gifit-configuration__link-dimensions"
							name="link_dimensions"
							type="checkbox"
							checked={this.state.link_dimensions}
							onChange={this._onChange}
						/>
						<div className="gifit__inputs">
							<label className="gifit__label" htmlFor="gifit-option-height">Height</label>
							<input 
								id="gifit-option-height"
								className="gifit__input"
								name="height"
								type="number"
								min="10"
								max="1080"
								value={this.state.height}
								onChange={this._onChange}
							/>
						</div>
					</fieldset>
					<fieldset>
						<div className="gifit__inputs">
							<label className="gifit__label" htmlFor="gifit-option-framerate">Frame Rate</label>
							<input
								id="gifit-option-framerate"
								className="gifit__input"
								name="framerate"
								type="number"
								min="1"
								max="60"
								value={this.state.framerate}
								onChange={this._onChange}
							/>
						</div>
					</fieldset>
					<fieldset>
						<div className="gifit__inputs gifit__inputs--range">
							<label className="gifit__label" htmlFor="gifit-option-quality">Quality</label>
							<input
								id="gifit-option-quality"
								className="gifit__input"
								name="quality"
								type="range"
								min="0"
								max="10"
								value={this.state.quality}
								onChange={this._onChange}
							/>
						</div>
					</fieldset>
					<div className="gifit-configuration__actions">
						<button
							id="gifit-submit"
							className="gifit-configuration__submit gifit__button gifit__button--primary"
							type="submit"
						>
							<span
								className="gifit-logo__gif gifit-logo__gif--primary"
							>GIF</span><span
								className="gifit-logo__it gifit-logo__it--primary"
							>it!</span>
						</button>
					</div>
				</form>
			</div>
		);
	},
	// Automatically update the height according to the video's aspect ratio
	_onVideoLoad: function(){
		var video_width = this._video_element.videoWidth;
		var video_height = this._video_element.videoHeight;
		var gif_height = Math.round( this.state.width * ( video_height / video_width ) );
		this.setState({
			height: gif_height
		});
	},
	// Update state according to change of input value
	_onChange: function( event ){
		var target_element = event.target;
		var new_props_object = {};
		new_props_object[target_element.name] = target_element.type === 'checkbox'
			? target_element.checked
			: target_element.value;
		this.setState( new_props_object );
	},
	_onSubmit: function( event ){
		event.preventDefault();
		this.props.onSubmit( this.state );
	}
});

module.exports = ConfigurationPanel;