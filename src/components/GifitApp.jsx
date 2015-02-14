var React = require('react');
var cx = require('classnames');

var gifit_events = require('../utils/gifit_events.js');
var GifService = require('../services/GifService.js');
var ConfigurationPanel = require('./ConfigurationPanel.jsx');
var Progress = require('./Progress.jsx');

var GifitApp = React.createClass({
	getInitialState: function(){
		return {
			configuration: {
				start: 0,
				end: 1,
				width: 320,
				height: 240,
				framerate: 10,
				quality: 5
			},
			progress: {
				status: null,
				percent: 0
			},
			image: null,
			active: false
		}
	},
	componentWillMount: function(){
		this._GifService = new GifService({
			source_video: this.props.video_element
		});
		this._GifService.on( 'progress', this._onGifProgress );
		this._GifService.on( 'complete', this._onGifComplete );
		gifit_events.on( 'toggle', this._onToggle );
	},
	componentWillUnmount: function(){
		gifit_events.off( 'toggle', this._onToggle );
		this._GifService.remove();
	},
	render: function(){
		var gifit_app_classes = cx({
			'gifit-app': true,
			'gifit': true,
			'gifit-app--active': this.state.active,
			'gifit-app--inactive': !this.state.active
		});
		return (
			<div className={gifit_app_classes}>
				<ConfigurationPanel
					configuration={this.state.configuration}
					onSubmit={this._onConfigurationSubmit}
				/>
				<Progress
					status={this.state.progress.status}
					percent={this.state.progress.percent}
					image={this.state.image}
				/>
			</div>
		);
	},
	_onConfigurationSubmit: function( configuration ){
		this.setState({
			configuration: configuration
		});
		this._GifService.createGif( configuration );
	},
	_onGifProgress: function( status, percent ){
		this.setState({
			progress: {
				status: status,
				percent: percent
			}
		});
	},
	_onGifComplete: function( image_blob ){
		this.setState({
			image: image_blob
		});
	},
	_onToggle: function(){
		this.setState({
			active: !this.state.active
		});
	}
});

module.exports = GifitApp;