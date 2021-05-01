import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDebouncedCallback } from 'use-debounce';
import { useMachine } from '@xstate/react';

import gifGenerationSystemMachine from '../state-machines/gif-generation-system';
import ControlBar from './control-bar.jsx';
import ResizeBar from './resize-bar.jsx';
import IncrementableInput from './incrementable-input.jsx';

import ArrowDown from '$icons/arrow-down.svg';
import Cancel from '$icons/cancel.svg';
import MediaPlay from '$icons/media-play.svg';
import Refresh from '$icons/refresh.svg';

function LabelledInput (props) {
  return (
    <label className="gifit__labelled-input">
      <span className="gifit__labelled-input__label">{props.name}</span>
      <div className="gifit__labelled-input__data">
        <input
          className="gifit__labelled-input__input"
          type="number"
          style={{
            width: `${props.width}px`
          }}
          value={props.value}
          onChange={props.onChange} />
        {props.addendum && <span className="gifit__labelled-input__addendum">{props.addendum}</span>}
      </div>
    </label>
  );
}

LabelledInput.defaultProps = {
  width: 100
};

function GifGenerationSystem (props) {
  const [state, send] = useMachine(gifGenerationSystemMachine);

  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [workspaceHeight, setWorkspaceHeight] = useState(0);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const contextRef = useRef(state.context);
  const widthProps = useSpring({ to: { width: workspaceWidth }});
  const heightProps = useSpring({ to: { height: workspaceHeight }});

  // draw the video to the preview canvas
  function drawFrame () {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(
        videoRef.current,
        0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
        0, 0, contextRef.current.width, contextRef.current.height
      );
    }
  }

  const debouncedDrawFrame = _.debounce(drawFrame, 250);

  useEffect(() => {
    debouncedDrawFrame();
  }, [state.context.width, state.context.height, state.context.gifData]);

  // set a reference to the state machine's context for use in other callbacks
  useEffect(() => {
    contextRef.current = state.context;
  }, [state.context]);

  // select the video and tell the machine we're ready to go
  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    videoRef.current = videoElements[0];

    videoRef.current.pause();
    videoRef.current.addEventListener('seeked', drawFrame);

    send('INITIALIZE_COMPLETE', {
      videoElement: videoRef.current
    });

    return () => {
      videoRef.current.removeEventListener('seekd', drawFrame);
    };
  }, []);

  // scrub the video to the start timecode when it changes
  useEffect(() => {
    if (_.isNumber(state.context.start) && !_.isNaN(state.context.start) && state.context.videoElement) {
      state.context.videoElement.currentTime = state.context.start;
    }
  }, [state.context.start]);

  // scrub the video to the end timecode when it changes
  useEffect(() => {
    if (_.isNumber(state.context.end) && !_.isNaN(state.context.end) && state.context.videoElement) {
      state.context.videoElement.currentTime = state.context.end;
    }
  }, [state.context.end]);

  // change the width of the workspace, but don't do it right away
  function setWorkspaceSize (_width, _height) {
    setWorkspaceWidth(_width);
    setWorkspaceHeight(_height);
  }

  const debouncedSetWorkspaceSize = useDebouncedCallback(setWorkspaceSize, 1000);

  useEffect(() => {
    debouncedSetWorkspaceSize(state.context.width, state.context.height);
  }, [state.context.width, state.context.height]);

  // input handling
  function handleWidthInputChange (event) {
    const newWidth = parseInt(event.target.value, 10) || 0;
    const aspectCorrectHeight = parseInt(newWidth / state.context.videoAspectRatio, 10);
    send('INPUT', { key: 'width', value: newWidth });
    send('INPUT', { key: 'height', value: aspectCorrectHeight });
  }

  function handleHeightInputChange (event) {
    const newHeight = parseInt(event.target.value, 10) || 0;
    const aspectCorrectWidth = parseInt(newHeight * state.context.videoAspectRatio, 10);
    send('INPUT', { key: 'width', value: aspectCorrectWidth });
    send('INPUT', { key: 'height', value: newHeight });
  }

  function handleQualityInputChange (event) {
    const newQuality = parseInt(event.target.value, 10) || 0;
    send('INPUT', { key: 'quality', value: newQuality });
  }

  function handleFrameRateInputChange (event) {
    const newFrameRate = parseInt(event.target.value, 10) || 0;
    send('INPUT', { key: 'fps', value: newFrameRate });
  }

  function handleStartInputChange (event) {
    const newStart = parseFloat(event?.target?.value || event) || 0;
    send('INPUT', { key: 'start', value: newStart });
  }

  function handleEndInputChange (event) {
    const newEnd = parseFloat(event?.target?.value || event) || 0;
    send('INPUT', { key: 'end', value: newEnd });
  }

  function handleStartEndControlBarChange ({ start, end, changed }) {
    send('INPUT', { key: 'start', value: start * videoRef.current.duration });
    send('INPUT', { key: 'end', value: end * videoRef.current.duration });

    const newTime = (changed === 'start')
      ? start * videoRef.current.duration
      : end * videoRef.current.duration;

    if (_.isNumber(newTime) && !_.isNaN(newTime)) {
      state.context.videoElement.currentTime = newTime;
    }
  }

  const handleWidthControlBarChange = function ({ scale, size }) {
    const newWidth = size;
    const newHeight = size / state.context.videoAspectRatio;
    send('INPUT', { key: 'width', value: newWidth });
    send('INPUT', { key: 'height', value: newHeight });
  }

  const handleHeightControlBarChange = function ({ scale, size }) {
    const newWidth = size * state.context.videoAspectRatio;
    const newHeight = size;
    send('INPUT', { key: 'width', value: newWidth });
    send('INPUT', { key: 'height', value: newHeight });
  }

  // form submit now handles:
  // generate
  // abort
  // reset
  function handleFormSubmit (event) {
    event.preventDefault();

    if (state.matches('configuring')) {
      send('SUBMIT');
      send('VALIDATION_SUCCESS');
    } else if (state.matches({ generating: { generatingGif: 'succeeded' }})) {
      // 'Reset'
      send('RESET');
    } else if (state.matches('generating')) {
      // Cancel
      send('ABORT');
    }
  }

  if (state.matches('initializing')) {
    return <div>Initializing</div>;
  }

  return (
    <form className="gif-generation-system ggs" onSubmit={handleFormSubmit}>
      <span className="ggs__corner" />
      <span className="ggs__corner" />
      <span className="ggs__corner" />
      <span className="ggs__corner" />

      <header className="ggs__head">
        GIF Generation System
      </header>

      <div className="ggs__width__bar" style={{ width: `${state.context.width}px` }}>
        <ResizeBar 
          value={state.context.width}
          onChange={handleWidthControlBarChange}
          disabled={!state.matches('configuring')} />
      </div>

      <div className="ggs__dimensions">
        <div className="ggs__width">
          <LabelledInput
            name="Width"
            addendum="px"
            value={state.context.width}
            onChange={handleWidthInputChange}
            width={100} />
        </div>
        <div className="ggs__height">
          <LabelledInput
            name="Height"
            addendum="px"
            value={state.context.height}
            onChange={handleHeightInputChange}
            width={100} />
        </div>
        <div className="ggs__height__bar" style={{ height: `${state.context.height}px` }}>
          <ResizeBar
            orientation="vertical"
            value={state.context.height}
            onChange={handleHeightControlBarChange}
            disabled={!state.matches('configuring')} />
        </div>
      </div>
      <div className="ggs__workspace">
        {state.matches({ generating: { generatingGif: 'succeeded' }}) &&
        <img src={URL.createObjectURL(state.context.gifData.blob)} />}
        {!state.matches({ generating: { generatingGif: 'succeeded' }}) &&
        <animated.canvas
          className="ggs__canvas"
          ref={canvasRef}
          style={{ ...widthProps, ...heightProps }}
          height={state.context.height}
          width={state.context.width} />}
      </div>
      <div className="ggs__quality-and-frame-rate">
        <LabelledInput
          name="Quality"
          value={state.context.quality}
          onChange={handleQualityInputChange} />
        <LabelledInput
          name="Frame Rate"
          addendum="fps"
          value={state.context.fps}
          onChange={handleFrameRateInputChange} />
      </div>
      <div className="ggs__start-and-end">
        <div className="ggs__time__bar">
          <ControlBar
            startValue={state.context.start / videoRef.current.duration}
            endValue={state.context.end / videoRef.current.duration}
            onChange={handleStartEndControlBarChange}
            disabled={!state.matches('configuring')} />
        </div>
        <label className="gifit__labelled-input">
          <span className="gifit__labelled-input__label">Start</span>
          <div className="gifit__labelled-input__data">
            <IncrementableInput
              value={state.context.start}
              increment={1 / state.context.fps}
              min={0}
              max={state.context.end}
              width="150px"
              onChange={handleStartInputChange} />
          </div>
        </label>
        
        <label className="gifit__labelled-input">
          <span className="gifit__labelled-input__label">End</span>
          <div className="gifit__labelled-input__data">
            <IncrementableInput
              value={state.context.end}
              increment={1 / state.context.fps}
              min={state.context.start}
              max={videoRef.current.duration}
              width="150px"
              onChange={handleEndInputChange} />
          </div>
        </label>
      </div>

      <footer className="ggs__footer">
        <div className="ggs__actions">
          <button
            className="ggs__generate ggs__action"
            type="submit">
            {state.matches('configuring')
              && <>Generate GIF <MediaPlay /></>}
            {state.matches('generating') && !state.matches({ generating: { generatingGif: 'succeeded' }})
              && <>Cancel <Cancel /></>}
            {state.matches({ generating: { generatingGif: 'succeeded' }})
              && <>Reset <Refresh /></>}
          </button>
          <a
            className="ggs__save"
            href={state?.context?.gifData?.blob ? URL.createObjectURL(state.context.gifData.blob) : null}
            download={`gifit_${Date.now()}.gif`}>
            <button
              className="ggs__save__button ggs__action"
              type="button"
              disabled={!state.matches({ generating: { generatingGif: 'succeeded' }})}>
              Save GIF <ArrowDown/>
            </button>
          </a>
        </div>
      </footer>
    </form>
  );
}

export default GifGenerationSystem;
