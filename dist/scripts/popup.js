(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var getFormData = require('./vendor/getFormData.js');

var options_form = document.querySelector('#options');
var record_button = document.querySelector('#record');
var stop_button = document.querySelector('#stop');

// hide stop by default
stop_button.style.display = 'none';

record_button.addEventListener( 'click', function( e ){
    e.preventDefault();
    var form_options = getFormData( options_form );
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, {
            action: 'record',
            options: form_options
        });
        record_button.style.display = 'none';
        stop_button.style.display = 'inline';
    });
});

stop_button.addEventListener( 'click', function( e ){
    e.preventDefault();
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, { action: 'stop' } );
        record_button.style.display = 'inline';
        stop_button.style.display = 'none';
    });
});

},{"./vendor/getFormData.js":2}],2:[function(require,module,exports){
var getFormData = function( form ){
    var form_data = {};
    Array.prototype.forEach.call( form.elements, function( el, i ){
        switch( el.tagName ){
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
                var value = el.value;
                if( el.type === 'number' || el.type === 'range' ){
                    value = parseInt( value, 10 );
                }
                form_data[el.name] = value;
            break;
        }
    });
    return form_data;
};

module.exports = getFormData;
},{}]},{},[1])