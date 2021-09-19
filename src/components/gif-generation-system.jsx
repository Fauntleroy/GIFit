import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useMachine } from '@xstate/react';

import * as css from './gif-generation-system.module.css';

import gifGenerationSystemMachine from '../state-machines/gif-generation-system';

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
import SystemVideoInfo from '$components/system-video-info.jsx';
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
      type: 'spring', damping: 45, delay: 1.25, stiffness: 500
    }
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      type: 'spring', damping: 45, delay: 1.25, stiffness: 500
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
  const widthBarRef = useRef(null);
  const heightRef = useRef(null);
  const heightBarRef = useRef(null);
  const timeBarRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const formRef = useRef(null);
  const saveRef = useRef(null);
  const formAnim = !state.matches('configuring') ? 'hidden' : 'shown';
  const frameTime = _.round(1 / state.context.fps, 2);

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
    ) {
      props.currentVideo.currentTime = state.context.start;
    }
  }, [state.context.start]);

  // scrub the video to the end timecode when it changes
  useEffect(() => {
    if (
      props.currentVideo
      && (state.matches('configuring') || state.matches('generating'))
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

    const newTime = (changed === 'start')
      ? start * props.currentVideo.duration
      : end * props.currentVideo.duration;

    if (_.isNumber(newTime) && !_.isNaN(newTime)) {
      props.currentVideo.currentTime = newTime;
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', delay: 0.25, stiffness: 400, damping: 50, mass: 10 }}>

      <SystemElements state={state} />

      <motion.form
        className={css.form}
        initial="hidden"
        animate="shown"
        variants={formAnimVariants}
        onSubmit={handleFormSubmit}
        ref={formRef}>

        <div className={css.comms}>
          <SystemComms ggsState={state} />
        </div>

        <motion.div
          className={css.widthBar}
          style={{ width: `${state.context.width}px` }}
          custom={0}
          animate={formAnim}
          variants={animVariants}
          ref={widthBarRef}>
        </motion.div>

        <motion.div
          className={css.videoInfo}
          custom={1}
          animate={formAnim}
          variants={animVariants}>
          <SystemVideoInfo video={props.currentVideo} gifUrl={gifUrl} />
        </motion.div>

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
          <div
            className={css.heightBar}
            style={{ height: `${state.context.height}px` }}
            ref={heightBarRef}>
          </div>
        </motion.div>
        
        <div className={css.workspace}>
          <ResizeWrapper
            orientation="vertical"
            value={state.context.height}
            onChange={handleHeightControlBarChange}
            disabled={!state.matches('configuring')}>
            <SystemWorkspace
              videoElement={props.currentVideo}
              width={state.context.width}
              height={state.context.height}
              gifUrl={gifUrl}
              isGenerating={state.matches('generating')}
              isComplete={state.matches({ generating: { generatingGif: 'succeeded' }})} />
          </ResizeWrapper>
        </div>

        <motion.div
          className={css.qualityAndFrameRate}
          custom={3}
          animate={formAnim}
          variants={animVariants}>
          <SystemInput
            name="Quality">
            <input
              className={css.qualityNumberInput}
              type="number"
              value={state.context.quality}
              min="1" max="10" step="1"
              style={{ flexShrink: '0' }}
              onChange={handleQualityInputChange}
              disabled={!state.matches('configuring')} />
          </SystemInput>
          <input
              className={css.qualityRangeInput}
              type="range"
              min="1" max="10" step="1"
              onChange={handleQualityInputChange}
              value={state.context.quality} />
          <SystemInput
            name="Frame Rate"
            addendum="fps">
            <InternalStateInput
              type="number"
              value={state.context.fps}
              onChange={handleFrameRateInputChange}
              disabled={!state.matches('configuring')} />
          </SystemInput>
          <div className={css.frameRate}>
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

        <motion.div
          className={css.lines}
          custom={7}
          animate={formAnim}
          variants={animVariants}>
          <AestheticLines
            widthRef={widthRef}
            widthBarRef={widthBarRef}
            heightRef={heightRef}
            heightBarRef={heightBarRef}
            startRef={startRef}
            endRef={endRef}
            timeBarRef={timeBarRef} />
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

GifGenerationSystem.propTypes = {
  currentVideo: PropTypes.object.isRequired
};

export default GifGenerationSystem;
