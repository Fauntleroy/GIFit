var React = require('react');

var toSeconds = require('../utils/toSeconds.js');

var ConfigurationPanel = React.createClass({
	getInitialState: function(){
		return {
			start: '0:00',
			end: '0:01',
			width: 320,
			height: 180,
			link_dimensions: true,
			framerate: 10,
			quality: 5,
			aspect_ratio: ( 16 / 9 )
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
		var aspect_ratio = ( video_width / video_height );
		this.setState({
			aspect_ratio: aspect_ratio
		});
		this.setOtherDimension( 'width', this.state.width );
	},
	// Update state according to change of input value
	_onChange: function( event ){
		var target_element = event.target;
		var prop = target_element.name;
		var value = target_element.value;
		var new_props_object = {};
		new_props_object[prop] = ( target_element.type === 'checkbox' )
			? target_element.checked
			: value;
		this.setState( new_props_object );
		// Update the width/height if necessary
		if( ( prop === 'width' || prop === 'height' ) && this.state.link_dimensions ){
			this.setOtherDimension( prop, value );
		} else if( prop === 'link_dimensions' ){
			this.setOtherDimension( 'width', this.state.width );
		}
		// If we're changing the start or end time, show that in the video
		if( prop === 'start' || prop === 'end' ){
			this.seekTo( value );
		}
	},
	_onSubmit: function( event ){
		event.preventDefault();
		this.props.onSubmit( this.state );
	},
	// Adjust width/height proportionally, based on the current video's aspect ratio
	setOtherDimension: function( other_dimension, other_dimension_value ){
		var dimension = ( other_dimension === 'width' )
			? 'height'
			: 'width';
		var new_state = {};
		if( dimension === 'width' ){
			new_state.width = Math.round( other_dimension_value * this.state.aspect_ratio );
		} else {
			new_state.height = Math.round( other_dimension_value / this.state.aspect_ratio );
		}
		this.setState( new_state );
	},
	// Seek to a specific position in the YouTube video
	seekTo: function( timecode ){
		var time = toSeconds( timecode );
		if( !this._video_element.paused ){
			this._video_element.pause();
		}
		if( time >= 0 ){
			this._video_element.currentTime = time;
		}
	}
});

module.exports = ConfigurationPanel;