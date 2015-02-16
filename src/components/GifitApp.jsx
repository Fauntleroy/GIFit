var React = require('react');
var cx = require('classnames');
var assign = require('lodash/object/assign');

var toSeconds = require('../utils/toSeconds.js');
var gifit_events = require('../utils/gifit_events.js');
var GifService = require('../services/GifService.js');
var ConfigurationPanel = require('./ConfigurationPanel.jsx');
var Progress = require('./Progress.jsx');

var GifitApp = React.createClass({
	getInitialState: function(){
		return {
			progress: {
				status: null,
				percent: 0
			},
			image: null,
			active: false
		}
	},
	componentWillMount: function(){
		this._video_element = this.props.video;
		this._gif_service = new GifService();
		this._gif_service.on( 'progress', this._onGifProgress );
		this._gif_service.on( 'complete', this._onGifComplete );
		this._gif_service.on( 'abort', this._onGifAbort );
		gifit_events.on( 'toggle', this._onToggle );
	},
	componentWillUnmount: function(){
		this._gif_service.destroy();
		gifit_events.off( 'toggle', this._onToggle );
	},
	render: function(){
		var gifit_app_classes = cx({
			'gifit-app': true,
			'gifit': true,
			'gifit-app--active': this.state.active,
			'gifit-app--inactive': !this.state.active,
			'gifit-app--status-generating': ( this.state.progress.percent > 0 && this.state.progress.percent < 100 ),
			'gifit-app--status-generated': !!this.state.image
		});
		return (
			<div className={gifit_app_classes}>
				<ConfigurationPanel
					video={this._video_element}
					onSubmit={this._onConfigurationSubmit}
				/>
				<Progress
					status={this.state.progress.status}
					percent={this.state.progress.percent}
					image={this.state.image}
					onCloseClick={this._onProgressCloseClick}
				/>
			</div>
		);
	},
	cleanProgressState: function(){
		this.setState({
			image: null,
			progress: {
				status: null,
				percent: 0
			}
		});
	},
	_onConfigurationSubmit: function( configuration ){
		// Copy, preprocess, and submit configuration object
		var gif_configuration = assign( {}, configuration, {
			start: parseInt( ( toSeconds( configuration.start ) ) * 1000 ),
			end: parseInt( ( toSeconds( configuration.end ) ) * 1000 )
		});
		this._gif_service.createGif( gif_configuration, this._video_element );
	},
	_onGifProgress: function( status, percent ){
		this.setState({
			progress: {
				status: status,
				percent: percent
			}
		});
	},
	_onGifComplete: function( image_attributes ){
		this.setState({
			image: image_attributes
		});
	},
	_onGifAbort: function(){
		this.cleanProgressState();
	},
	_onProgressCloseClick: function(){
		this._gif_service.abort();
		this.cleanProgressState();
	},
	_onToggle: function(){
		this.setState({
			active: !this.state.active
		});
	}
});

module.exports = GifitApp;