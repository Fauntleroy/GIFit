const EventEmitter = require('events').EventEmitter;

// EventEmitter used to communicate between the toolbar button and app
module.exports = new EventEmitter();
