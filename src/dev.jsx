const startButtonElement = document.querySelector('#start');

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import GifitApp from '$components/gifit-app.jsx';

// Set up a false GIFti app to lie to ourselves
function TestGifitApp () {
  const [active, setActive] = useState(false);

  useEffect(() => {
    startButtonElement.addEventListener('click', function (event) {
      event.preventDefault();

      setActive(true);
    });
  }, []);

  function handleClose () {
    setActive(false);
  }

  return (
    <GifitApp active={active} onClose={handleClose} />
  );
}

// Engage party mode
// Party mode = initialize React apps in DOM
const gifitElement = document.createElement('div');
gifitElement.id = 'gifit';
document.body.appendChild(gifitElement);

ReactDOM.render(<TestGifitApp />, gifitElement);
