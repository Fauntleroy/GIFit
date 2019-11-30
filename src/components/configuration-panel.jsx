import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useReducer } from 'react';

import toSeconds from '../utils/to-seconds.js';

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 180;

function seekTo (videoElement, timecode) {
  const time = toSeconds(timecode);

  if (!videoElement.paused) {
    videoElement.pause();
  }

  videoElement.currentTime = _.clamp(time, 0, videoElement.duration);
}

function getVideoAspectRatio (videoElement) {
  return (videoElement.videoWidth / videoElement.videoHeight);
}

function reducer (state, action) {
  switch (action.type) {
    case 'INPUT_CHANGE': {
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value
      };

      // adjust other dimension if they are linked
      if (state.linkDimensions) {
        if (action.payload.name === 'width') {
          newState.height = Math.round(action.payload.value / state.aspectRatio);
        } else if (action.payload.name === 'height') {
          newState.width = Math.round(action.payload.value * state.aspectRatio);
        }
      }

      // adjust height if linkDimensions is turned on
      if (action.payload.name === 'linkDimensions' && action.payload.value) {
        newState.height = Math.round(state.width / state.aspectRatio);
      }

      return newState;
    }
    case 'VIDEO_LOADED_DATA':
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
}

function ConfigurationPanel (props) {
  const [state, dispatch] = useReducer(reducer, {
    start: '0:00',
    end: '0:01',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    linkDimensions: true,
    framerate: 10,
    quality: 5,
    aspectRatio: DEFAULT_WIDTH / DEFAULT_HEIGHT
  });

  useEffect(() => {
    function handleVideoLoadedData () {
      // set some default values here
      const aspectRatio = getVideoAspectRatio(props.video);

      dispatch({
        type: 'VIDEO_LOADED_DATA',
        payload: {
          aspectRatio
        }
      });
    }

    return () => {
      if (!props.video) {
        return;
      }

      props.video.addEventListener('loadeddata', handleVideoLoadedData);

      return () => {
        props.video.removeEventListener('loadeddata', handleVideoLoadedData);
      };
    };
  }, [props.video]);

  function handleInputChange (event) {
    const fieldName = event.target.name;
    const newValue = (event.target.type === 'checkbox')
      ? event.target.checked
      : event.target.value;

    dispatch({
      type: 'INPUT_CHANGE',
      payload: {
        name: fieldName,
        value: newValue
      }
    });

    // If we're changing the start or end time, show that in the video
    if (fieldName === 'start' || fieldName === 'end') {
      seekTo(props.video, newValue);
    }

    // TODO If start time is greater than end time, adjust
  }

  function handleSubmit (event) {
    event.preventDefault();
    props.onSubmit(state);
  }

  return (
    <div className="gifit-configuration">
      <form onSubmit={handleSubmit}>
        <fieldset className="gifit__fieldset--horizontal">
          <div className="gifit__inputs">
            <label className="gifit__label" htmlFor="gifit-option-start">Start</label>
            <input
              id="gifit-option-start"
              className="gifit__input"
              name="start"
              type="text"
              value={state.start}
              onChange={handleInputChange} />
          </div>
          <div className="gifit__inputs">
            <label className="gifit__label" htmlFor="gifit-option-end">End</label>
            <input
              id="gifit-option-end"
              className="gifit__input"
              name="end"
              type="text"
              value={state.end}
              onChange={handleInputChange} />
          </div>
        </fieldset>
        <fieldset className="gifit__fieldset--horizontal">
          <div className="gifit__inputs">
            <label className="gifit__label" htmlFor="gifit-option-width">Width</label>
            <input
              id="gifit-option-width"
              className="gifit__input"
              name="width"
              type="number"
              min="10"
              max="1920"
              value={state.width}
              onChange={handleInputChange} />
          </div>
          <div className="gifit__inputs">
            <label className="gifit__label" htmlFor="gifit-option-height">Height</label>
            <input
              id="gifit-option-height"
              className="gifit__input"
              name="height"
              type="number"
              min="10"
              max="1080"
              value={state.height}
              onChange={handleInputChange} />
          </div>
          <input
            className="gifit-configuration__link-dimensions"
            name="linkDimensions"
            type="checkbox"
            checked={state.linkDimensions}
            onChange={handleInputChange} />
        </fieldset>
        <fieldset className="gifit__fieldset--horizontal">
          <div className="gifit__inputs">
            <label className="gifit__label" htmlFor="gifit-option-framerate">Frame Rate</label>
            <input
              id="gifit-option-framerate"
              className="gifit__input"
              name="framerate"
              type="number"
              min="1"
              max="60"
              value={state.framerate}
              onChange={handleInputChange} />
          </div>
          <div className="gifit__inputs gifit__inputs--range">
            <label className="gifit__label" htmlFor="gifit-option-quality">Quality</label>
            <input
              id="gifit-option-quality"
              className="gifit__input"
              name="quality"
              type="range"
              min="0"
              max="10"
              value={state.quality}
              onChange={handleInputChange} />
          </div>
        </fieldset>
        <div className="gifit-configuration__actions">
          <button
            id="gifit-submit"
            className="gifit-configuration__submit gifit__button gifit__button--primary gifit__button--large"
            type="submit">
            <span className="gifit-logo__gif gifit-logo__gif--primary">GIF</span>
            <span className="gifit-logo__it gifit-logo__it--primary">it!</span>
          </button>
        </div>
      </form>
    </div>
  );
}

ConfigurationPanel.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  video: PropTypes.element.isRequired
};

export default ConfigurationPanel;
