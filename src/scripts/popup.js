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
