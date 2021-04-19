import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDebouncedCallback } from 'use-debounce';
import { useMachine } from '@xstate/react';

import gifGenerationSystemMachine from '../state-machines/gif-generation-system';

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

  const [workspaceWidth, setWorkspaceWidth] = useState(420);
  const [workspaceHeight, setWorkspaceHeight] = useState(315);
  const [frame, setFrame] = useState(0);
  const canvasRef = useRef(null);
  const widthProps = useSpring({ to: { width: workspaceWidth }});
  const heightProps = useSpring({ to: { height: workspaceHeight }});

  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    const videoElement = videoElements[0];

    videoElement.pause();

    send('INITIALIZE_COMPLETE', {
      videoElement
    });

    // const intervalId = setInterval(() => {
    //   setFrame(_frame => _frame + 1);
    // }, 1000 / 60);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    const context = canvasRef.current.getContext('2d');
    context.drawImage(
      videoElements[0],
      // 0, 0, videoElements[0].offsetWidth, videoElements[0].offsetHeight,
      0, 0, state.context.width, state.context.height
    );
  }, [frame]);

  function setWorkspaceSize (_width, _height) {
    setWorkspaceWidth(_width);
    setWorkspaceHeight(_height);
  }

  const debouncedSetWorkspaceSize = useDebouncedCallback(setWorkspaceSize, 1500);

  useEffect(() => {
    debouncedSetWorkspaceSize(state.context.width, state.context.height);
  }, [state.context.width, state.context.height]);

  function handleWidthInputChange (event) {
    const newWidth = parseInt(event.target.value, 10);
    const aspectCorrectHeight = parseInt(newWidth / state.context.videoAspectRatio, 10);
    send('INPUT', { key: 'width', value: newWidth });
    send('INPUT', { key: 'height', value: aspectCorrectHeight });
  }

  function handleHeightInputChange (event) {
    const newHeight = parseInt(event.target.value, 10);
    const aspectCorrectWidth = parseInt(newHeight * state.context.videoAspectRatio, 10);
    send('INPUT', { key: 'width', value: aspectCorrectWidth });
    send('INPUT', { key: 'height', value: newHeight });
  }

  function handleQualityInputChange (event) {
    const newQuality = parseInt(event.target.value, 10);
    send('INPUT', { key: 'quality', value: newQuality });
  }

  function handleFrameRateInputChange (event) {
    const newFrameRate = parseInt(event.target.value, 10);
    send('INPUT', { key: 'fps', value: newFrameRate });
  }

  function handleStartInputChange (event) {
    const newStart = parseFloat(event.target.value);
    send('INPUT', { key: 'start', value: newStart });

    if (_.isNumber(newStart) && !_.isNaN(newStart)) {
      state.context.videoElement.currentTime = newStart;
    }
  }

  function handleEndInputChange (event) {
    const newEnd = parseFloat(event.target.value);
    send('INPUT', { key: 'end', value: newEnd });

    if (_.isNumber(newEnd) && !_.isNaN(newEnd)) {
      state.context.videoElement.currentTime = newEnd;
    }
  }

  function handleFormSubmit (event) {
    event.preventDefault();
    send('SUBMIT');
    send('VALIDATION_SUCCESS');
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

      <div className="ggs__width">
        <LabelledInput
          name="Width"
          addendum="px"
          value={state.context.width}
          onChange={handleWidthInputChange}
          width={100} />
        <animated.div className="ggs__width__bar" style={{ ...widthProps }} />
      </div>
      <div className="ggs__height">
        <LabelledInput
          name="Height"
          addendum="px"
          value={state.context.height}
          onChange={handleHeightInputChange}
          width={100} />
        <animated.div className="ggs__height__bar" style={{ ...heightProps }} />
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
        <div className="ggs__time__bar" />
        <LabelledInput
          name="Start"
          value={state.context.start}
          onChange={handleStartInputChange} />
        <LabelledInput
          name="End"
          value={state.context.end}
          onChange={handleEndInputChange} />
      </div>

      <footer className="ggs__footer">
        <button className="ggs__generate" type="submit">Generate GIF</button>
      </footer>
    </form>
  );
}

export default GifGenerationSystem;
