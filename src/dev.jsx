const startButtonElement = document.querySelector('#start');

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import GifGenerationSystem from './components/gif-generation-system.jsx';

import Times from '$icons/times.svg';

// Set up a false GIFti app to lie to ourselves
function TestGifitApp (props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    startButtonElement.addEventListener('click', function (event) {
      event.preventDefault();

      setActive(true);
    });
  }, []);

  function handleCloseClick (event) {
    event.preventDefault();
    setActive(false);
  }

  return (
    <div className="gifit-app" style={{ display: active ? 'flex' : 'none' }}>
      {active &&
        <>
          <button className="gifit-app__close" type="button" onClick={handleCloseClick}>Close GIFit <Times style={{ width: '12px' }} /></button>
          <GifGenerationSystem />
        </>
      }
    </div>
  );
}

// Engage party mode
// Party mode = initialize React apps in DOM
const gifitElement = document.createElement('div');
gifitElement.id = 'gifit';
document.body.appendChild(gifitElement);

ReactDOM.render(<TestGifitApp />, gifitElement);
