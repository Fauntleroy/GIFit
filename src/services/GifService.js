var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var GifService = function(){
	EventEmitter.call( this );
};

inherits( GifService, EventEmitter );

module.exports = GifService;