import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useRef } from 'react';

import toSeconds from '../utils/to-seconds.js';
import gifitEvents from '../utils/gifit-events.js';
import GifService from '../services/gif-service.js';
import ConfigurationPanel from './configuration-panel.jsx';
import Progress from './progress.jsx';

const DEFAULT_STATE = {
  progress: {
    status: null,
    percent: 0
  },
  image: null,
  active: false
};

function reducer (state, action) {
  switch (action.type) {
    case 'ABORT':
      return {
        ...state,
        image: null,
        progress: {
          status: null,
          percent: 0
        }
      };
    case 'PROGRESS':
      return {
        ...state,
        progress: {
          status: action.payload.status,
          percent: action.payload.percent
        }
      };
    case 'COMPLETE':
      return {
        ...state,
        image: action.payload
      };
    case 'TOGGLE':
      return {
        ...state,
        active: !state.active
      };
    case 'RESET':
      return {
        ...DEFAULT_STATE,
        active: true
      };
    default:
      return {
        ...state
      };
  }
}

function GifitApp (props) {
  const gifService = useRef();

  const [state, dispatch] = useReducer(reducer, {
    ...DEFAULT_STATE
  });

  function handleToggle () {
    if (!state.active) {
      props.video.pause();
    }

    dispatch({ type: 'TOGGLE' });
  }

  function handleConfigurationSubmit (configuration) {
    const gifConfiguration = {
      ...configuration,
      start: parseInt(toSeconds(configuration.start) * 1000, 10),
      end: parseInt(toSeconds(configuration.end) * 1000, 10)
    };
    gifService.current.createGif(gifConfiguration, props.video);
  }

  function handleProgressCloseClick () {
    gifService.current.abort();
    dispatch({ type: 'RESET' });
  }

  useEffect(() => {
    const _gifService = gifService.current = new GifService();
    _gifService.on('progress', (status, percent) => {
      dispatch({ type: 'PROGRESS', payload: { status, percent }});
    });
    _gifService.on('complete', (image) => {
      dispatch({ type: 'COMPLETE', payload: image });
    });
    _gifService.on('abort', () => dispatch({ type: 'ABORT' }));
    gifitEvents.on('toggle', handleToggle);

    return () => {
      _gifService.destroy();
      gifitEvents.off('toggle', handleToggle);
    };
  }, []);

  const className = cx({
    'gifit-app': true,
    'gifit': true,
    'gifit-app--active': state.active,
    'gifit-app--inactive': !state.active,
    'gifit-app--status-generating': (state.progress.percent > 0 && state.progress.percent < 100),
    'gifit-app--status-generated': !!state.image
  });

  return (
    <div className={className}>
      <ConfigurationPanel
        video={props.video}
        onSubmit={handleConfigurationSubmit} />
      <Progress
        status={state.progress.status}
        percent={state.progress.percent}
        image={state.image}
        onCloseClick={handleProgressCloseClick} />
    </div>
  );
}

GifitApp.propTypes = {
  video: PropTypes.element.isRequired
};

export default GifitApp;
