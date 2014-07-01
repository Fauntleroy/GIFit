var record_el = document.querySelector('#record');
var stop_el = document.querySelector('#stop');

// hide stop by default
stop_el.style.display = 'none';

record_el.addEventListener( 'click', function( e ){
    e.preventDefault();
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, { action: 'record' } );
        record_el.style.display = 'none';
        stop_el.style.display = 'inline';
    });
});

stop_el.addEventListener( 'click', function( e ){
    e.preventDefault();
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, { action: 'stop' } );
        record_el.style.display = 'inline';
        stop_el.style.display = 'none';
    });
});
