import React from 'react';

import gifitEvents from '../utils/gifit-events.js';

function GifitButton () {
  function handleClick (event) {
    event.preventDefault();
    gifitEvents.emit('toggle');
  }

  return (
    <div
      className="gifit-button gifit-logo"
      role="button"
      onClick={handleClick}>
      <span className="gifit-logo__gif">GIF</span>
      <span className="gifit-logo__it">it!</span>
    </div>
  );
}

export default GifitButton;
