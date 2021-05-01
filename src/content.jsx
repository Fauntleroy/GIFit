import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import GifitApp from './components/gifit-app.jsx';

const browser = window.browser || window.chrome;

// Engage party mode
// Party mode = initialize React apps in DOM
const gifitElement = document.createElement('div');
gifitElement.id = 'gifit';
document.body.appendChild(gifitElement);

function ContentApp () {
  const [active, setActive] = useState(false);

  useEffect(() => {
    browser.runtime.onMessage.addListener(() => {
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

ReactDOM.render(<ContentApp />, gifitElement);
