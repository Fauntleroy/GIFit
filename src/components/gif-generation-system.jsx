import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useMachine } from '@xstate/react';

import * as css from './gif-generation-system.module.css';

import gifGenerationSystemMachine from '../state-machines/gif-generation-system';
import getVibrantColors from '../utils/get-vibrant-colors';

import Button from '$components/button.jsx';
import ControlBar from '$components/control-bar.jsx';
import ResizeWrapper from '$components/resize-wrapper.jsx';
import IncrementableInput from '$components/incrementable-input.jsx';
import InternalStateInput from '$components/internal-state-input.jsx';
import AestheticLines from '$components/aesthetic-lines.jsx';
import SystemComms from '$components/system-comms.jsx';
import SystemElements from '$components/system-elements.jsx';
import SystemInput from '$components/system-input.jsx';
import SystemFrames from '$components/system-frames.jsx';
import SystemFrameRate from '$components/system-frame-rate.jsx';
import SystemWorkspace from '$components/system-workspace.jsx';
import SystemMessage from '$components/system-message.jsx';

import ArrowDown from '$icons/arrow-down.svg';
import Cancel from '$icons/cancel.svg';
import MediaPlay from '$icons/media-play.svg';
import Refresh from '$icons/refresh.svg';

const formAnimVariants = {
  shown: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring', damping: 45, delay: 1.15, stiffness: 500
    }
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      type: 'spring', damping: 45, delay: 1.15, stiffness: 500
    }
  }
}

const animVariants = {
  shown: (custom = 0) => ({
    opacity: 1,
    transition: {
      type: 'spring',
      tension: 175,
      damping: 25,
      mass: 5,
      delay: 0.075 * (8 - custom)
    }
  }),
  hidden: (custom = 0) => ({
    opacity: 0.075,
    transition: {
      type: 'spring',
      tension: 175,
      damping: 25,
      mass: 5,
      delay: 0.075 * (custom + 1)
    }
  })
};

function GifGenerationSystem (props) {
  const [state, send] = useMachine(gifGenerationSystemMachine);

  const widthRef = useRef(null);
  const heightRef = useRef(null);
  const timeBarRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const formRef = useRef(null);
  const saveRef = useRef(null);
  const workspaceRef = useRef(null);
  const qualityRef = useRef(null);
  const frameRateRef = useRef(null);
  const formAnim = !state.matches('configuring') ? 'hidden' : 'shown';
  const frameTime = _.round(1 / state.context.fps, 2);
  const [vibrantColor, setVibrantColor] = useState(null);
  const [formAnimationIsComplete, setFormAnimationIsComplete] = useState(false);

  useEffect(() => {
    if (widthRef.current) {
      widthRef.current.querySelector('input').focus();
    }
  }, [widthRef.current]);

  useEffect(() => {
    send('INITIALIZE', { videoElement: props.currentVideo });
  }, []);

  // TODO don't seek on initial open
  // scrub the video to the start timecode when it changes
  useEffect(() => {
    if (
      props.currentVideo
      && (state.matches('configuring') || state.matches('generating'))
      && formAnimationIsComplete
    ) {
      props.currentVideo.currentTime = state.context.start;
    }
  }, [state.context.start]);

  // scrub the video to the end timecode when it changes
  useEffect(() => {
    if (
      props.currentVideo
      && (state.matches('configuring') || state.matches('generating'))
      && formAnimationIsComplete
    ) {
      props.currentVideo.currentTime = state.context.end;
    }
  }, [state.context.end]);

  useEffect(() => {
    function handlePlay () {
      props.currentVideo.pause();
    }

    if (props.currentVideo) {
      props.currentVideo.addEventListener('play', handlePlay);
    }

    return () => {
      if (props.currentVideo) props.currentVideo.removeEventListener('play', handlePlay);
    }
  }, [props.currentVideo]);

  const updateVibrantColor = useCallback(_.debounce(async (videoEl) => {
    const vibrantColors = await getVibrantColors(videoEl);

    setVibrantColor(vibrantColors[0]);
  }, 2500), []);

  useEffect(() => {
    updateVibrantColor(props.currentVideo);
  }, [props.currentVideo, state.context.start, state.context.end, state.context.gifData]);

  useEffect(() => {
    if (saveRef.current) {
      saveRef.current.focus();
    }
  }, [state.context.gifData]);

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
    send('INPUT', { key: 'start', value: start * props.currentVideo.duration });
    send('INPUT', { key: 'end', value: end * props.currentVideo.duration });
  }

  function handleTimeRangeChange (event) {
    send('INPUT', { key: 'timerange', value: event.value });
  }

  const handleResizeWrapperChange = function ({ scale, size }) {
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

  function handleFormAnimationComplete () {
    setFormAnimationIsComplete(true);
  }

  if (state.matches('initializing')) {
    return <SystemMessage title="Initializing">Initializing</SystemMessage>;
  }

  let submitButtonContents = [];

  if (state.matches('configuring')) {
    submitButtonContents = ['Generate GIF', <MediaPlay />];
  } else if (state.matches('generating') && !state.matches({ generating: { generatingGif: 'succeeded' }})) {
    submitButtonContents = ['Cancel', <Cancel />];
  } else if (state.matches({ generating: { generatingGif: 'succeeded' }})) {
    submitButtonContents = ['Reset', <Refresh />];
  }

  const isComplete = state.matches({ generating: { generatingGif: 'succeeded' }});
  const gifUrl = state?.context?.gifData?.blob ? URL.createObjectURL(state.context.gifData.blob) : null;

  return (
    <motion.div
      className={css.ggs}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.25, stiffness: 100, damping: 10, mass: 0.25 }}
      style={_.isObject(vibrantColor) ? {
        boxShadow: `rgba(${vibrantColor.red}, ${vibrantColor.green}, ${vibrantColor.blue}, 0.1) 0 -40px 100px inset`
      } : null}>

      <SystemElements state={state} />

      <motion.div
        className={css.main}
        initial="hidden"
        animate="shown"
        variants={formAnimVariants}
        onAnimationComplete={handleFormAnimationComplete}>
        <motion.div
          animate={{
            opacity: !state.matches('configuring') ? 0 : 1
          }}
          transition={{ delay: 0.5 }}>
          <AestheticLines
            widthRef={widthRef}
            heightRef={heightRef}
            startRef={startRef}
            endRef={endRef}
            timeBarRef={timeBarRef}
            workspaceRef={workspaceRef}
            qualityRef={qualityRef}
            frameRateRef={frameRateRef} />
        </motion.div>

        <form
          className={css.form}
          onSubmit={handleFormSubmit}
          ref={formRef}>

          <div className={css.comms}>
            <SystemComms ggsState={state} />
          </div>

          <motion.div
            className={css.dimensions}
            custom={2}
            animate={formAnim}
            variants={animVariants}>
            <div className={css.width} ref={widthRef}>
              <SystemInput
                name="Width"
                addendum="px">
                <InternalStateInput
                  type="number"
                  value={state.context.width}
                  onChange={handleWidthInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
            </div>
            <div className={css.height} ref={heightRef}>
              <SystemInput
                name="Height"
                addendum="px">
                <InternalStateInput
                  type="number"
                  value={state.context.height}
                  onChange={handleHeightInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
            </div>
          </motion.div>
          
          <div className={css.workspace} ref={workspaceRef}>
            <ResizeWrapper
              orientation="vertical"
              value={state.context.height}
              onChange={handleResizeWrapperChange}
              disabled={!state.matches('configuring')}>
              <SystemWorkspace
                videoElement={props.currentVideo}
                width={state.context.width}
                height={state.context.height}
                gifUrl={gifUrl}
                isGenerating={state.matches('generating')}
                isComplete={state.matches({ generating: { generatingGif: 'succeeded' }})}
                vibrantColor={vibrantColor} />
            </ResizeWrapper>
          </div>

          <motion.div
            className={css.qualityAndFrameRate}
            custom={3}
            animate={formAnim}
            variants={animVariants}>
            <div ref={qualityRef}>
              <SystemInput
                name="Quality"
                addendum={<input
                  className={css.qualityRangeInput}
                  type="range"
                  min="1" max="10" step="1"
                  onChange={handleQualityInputChange}
                  value={state.context.quality} />}>
                <input
                  className={css.qualityNumberInput}
                  type="number"
                  value={state.context.quality}
                  min="1" max="10" step="1"
                  style={{ flexShrink: '0' }}
                  onChange={handleQualityInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
            </div>
            <div ref={frameRateRef}>
              <SystemInput
                name="Frame Rate"
                addendum="fps">
                <InternalStateInput
                  type="number"
                  value={state.context.fps}
                  onChange={handleFrameRateInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
              <SystemFrameRate fps={state.context.fps} />
            </div>
          </motion.div>

          <div className={css.startAndEnd}>
            <motion.div
              className={css.timeBar}
              custom={4}
              animate={formAnim}
              variants={animVariants}
              ref={timeBarRef}>
              <input type="range" onChange={handleTimeRangeChange} min={0} max={props.currentVideo.duration} step={0.01} />
              <ControlBar
                startValue={state.context.start / props.currentVideo.duration}
                endValue={state.context.end / props.currentVideo.duration}
                minimumDistance={frameTime / props.currentVideo.duration}
                onChange={handleStartEndControlBarChange}
                disabled={!state.matches('configuring')} />
            </motion.div>

            <motion.div
              className={css.start}
              custom={5}
              animate={formAnim}
              variants={animVariants}
              ref={startRef}>
              <SystemInput
                className={css.startInput}
                name="start">
                <IncrementableInput
                  value={state.context.start}
                  increment={frameTime}
                  min={0}
                  max={props.currentVideo.duration - frameTime}
                  width="200px"
                  onChange={handleStartInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
            </motion.div>

            <motion.div
              className={css.frames}
              variants={animVariants}
              animate={state.matches({ generating: { generatingGif: 'succeeded' }}) ? 'hidden' : 'shown'}>
              <SystemFrames state={state} />
            </motion.div>
            
            <motion.div
              className={css.end}
              custom={6}
              animate={formAnim}
              variants={animVariants}
              ref={endRef}>
              <SystemInput
                className={css.endInput}
                name="end">
                <IncrementableInput
                  value={state.context.end}
                  increment={frameTime}
                  min={0 + frameTime}
                  max={props.currentVideo.duration}
                  width="200px"
                  onChange={handleEndInputChange}
                  disabled={!state.matches('configuring')} />
              </SystemInput>
            </motion.div>
          </div>

          <motion.footer className={css.footer}>
            <motion.div
              className={css.actions}
              animate={{ y: isComplete ? '-125%' : '0%' }}
              transition={{ type: 'spring', mass: 0.5, stiffness: 500, damping: 50, delay: 0.35 }}>
              <AnimatePresence>
                <motion.span
                  className={css.action}
                  key="primary-action"
                  initial={{ width: '0px' }}
                  animate={{ width: 'auto' }}
                  exit={{ width: '0px' }}>
                  <Button
                    type="submit"
                    icon={submitButtonContents[1]}
                    style={{ width: '200px' }}>
                    {submitButtonContents[0]}
                  </Button>
                </motion.span>
                {/* I don't want to animate the margin, but framer isn't measuring right. TODO update when framer does */}
                {isComplete && <motion.a
                  className={css.action}
                  href={gifUrl}
                  download={`gifit_${Date.now()}.gif`}
                  tabIndex="-1"
                  key="save-action"
                  initial={{ width: '0px', scaleY: 0, opacity: 0, margin: '0px 0px' }}
                  animate={{ width: 'auto', scaleY: 1, opacity: 1, margin: '0px 5px' }}
                  exit={{ width: '0px', scaleY: 0, opacity: 0, margin: '0px 0px' }}
                  transition={{ type: 'spring', mass: 0.5, stiffness: 500, damping: 50, mass: 0.25 }}>
                  <Button
                    type="button"
                    icon={<ArrowDown />}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    disabled={!isComplete}
                    ref={saveRef}>
                    Save GIF
                  </Button>
                </motion.a>}
              </AnimatePresence>
            </motion.div>
          </motion.footer>
        </form>
      </motion.div>
    </motion.div>
  );
}

GifGenerationSystem.propTypes = {
  currentVideo: PropTypes.object.isRequired
};

export default GifGenerationSystem;
