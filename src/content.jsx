import React from 'react';
import ReactDOM from 'react-dom';

import gifitEvents from './utils/gifit-events.js';
import GifitButton from './components/gifit-button.jsx';
import GifitApp from './components/gifit-app.jsx';

function initializeGifit (youtubePlayerApiElement) {
  const is2015Player = !!youtubePlayerApiElement.querySelector(':scope .ytp-chrome-controls');
  const is2018Player = !!document.querySelector('#movie_player');

  // Find YouTube elements we'll be injecting into
  var youtubePlayerChromeElement = youtubePlayerApiElement.querySelector(':scope .html5-player-chrome, :scope .ytp-chrome-bottom');
  var youtubePlayerControlsElement = youtubePlayerApiElement.querySelector(':scope .html5-video-controls, :scope .ytp-chrome-controls');
  var youtubePlayerVideoElement = youtubePlayerApiElement.querySelector(':scope video');

  // If GIFit can't find the appropriate elements it does not start
  if (!youtubePlayerChromeElement || !youtubePlayerControlsElement || !youtubePlayerVideoElement) {
    return;
  }

  // GIFit needs containers since React.renderComponent annihilates the contents of its target
  const gifitButtonContainerElement = document.createElement('div');
  gifitButtonContainerElement.classList.add('ytp-button', 'ytp-button-gif');
  const gifitAppContainerElement = document.createElement('div');

  if (is2015Player) {
    youtubePlayerControlsElement.appendChild(gifitButtonContainerElement);
  } else {
    youtubePlayerChromeElement.appendChild(gifitButtonContainerElement);
  }
  youtubePlayerControlsElement.appendChild(gifitAppContainerElement);

  // Highlight GIFit toolbar button when active
  var gifitButtonActive = false;
  gifitEvents.on('toggle', function () {
    gifitButtonActive = !gifitButtonActive;
    if (gifitButtonActive) {
      youtubePlayerApiElement.classList.add('gifit--active');
    } else {
      youtubePlayerApiElement.classList.remove('gifit--active');
    }
  });

  // Prevent YouTube's events from firing in GIFit's interface
  function stopImmediatePropagation (event) {
    event.stopImmediatePropagation();
  }
  gifitAppContainerElement.addEventListener('keydown', stopImmediatePropagation);
  gifitAppContainerElement.addEventListener('keypress', stopImmediatePropagation);
  gifitAppContainerElement.addEventListener('contextmenu', stopImmediatePropagation);

  // Engage party mode
  // Party mode = initialize React apps in DOM
  ReactDOM.render(<GifitButton />, gifitButtonContainerElement);
  ReactDOM.render(<GifitApp video={youtubePlayerVideoElement} />, gifitAppContainerElement);

  // Mark territory
  youtubePlayerApiElement.classList.add('gifit--initialized');

  // If it's the 2015 player, add modifier class
  if (is2015Player) {
    youtubePlayerApiElement.classList.add('gifit-ytp-2015');
  }
}

// Scan the page for YouTube players
// Inject GIFit into all players found
// This is super nasty but it's the least brittle way to do things. C'est la vie.
function scanPage () {
  const youtubePlayerApiElements = document.querySelectorAll('#player-api:not(.gifit--initialized):not(.off-screen-target), #movie_player:not(.gifit--initialized)');
  for (const youtubePlayerApiElement of youtubePlayerApiElements) {
    initializeGifit(youtubePlayerApiElement);
  }
}

scanPage();
setInterval(scanPage, 1000);
