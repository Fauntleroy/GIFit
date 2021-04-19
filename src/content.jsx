import React from 'react';
import ReactDOM from 'react-dom';

import GifitApp from './components/gifit-app.jsx';

// Engage party mode
// Party mode = initialize React apps in DOM
const gifitElement = document.createElement('div');
gifitElement.id = 'gifit';
document.body.appendChild(gifitElement);

ReactDOM.render(<GifitApp />, gifitElement);
