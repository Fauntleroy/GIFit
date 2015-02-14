var React = require('react');

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
			image: null
		}
	},
	componentWillMount: function(){
		this._GifService = new GifService({
			source_video: this.props.video_element
		});
		this._GifService.on( 'progress', this._onGifProgress );
		this._GifService.on( 'complete', this._onGifComplete );
	},
	componentWillUnmount: function(){
		this._GifService.remove();
	},
	render: function(){
		return (
			<div className="gifit-app gifit">
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
	show: function(){

	},
	hide: function(){

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
	}
});

module.exports = GifitApp;