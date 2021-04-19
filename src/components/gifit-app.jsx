import React, { useEffect, useState } from 'react';
import GifGenerationSystem from './gif-generation-system.jsx';

const browser = window.browser || window.chrome;

function GifitApp (props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    browser.runtime.onMessage.addListener((request, sender) => {
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
          <button className="gifit-app__close" type="button" onClick={handleCloseClick}>Close GIFit</button>
          <GifGenerationSystem />
        </>
      }
    </div>
  );
}

export default GifitApp;
