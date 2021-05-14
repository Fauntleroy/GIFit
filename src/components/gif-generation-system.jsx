import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMachine } from '@xstate/react';

import * as css from './gif-generation-system.module.css';

import gifGenerationSystemMachine from '../state-machines/gif-generation-system';
import findClosestElement from '$utils/find-closest-element';

import Button from './button.jsx';
import ControlBar from './control-bar.jsx';
import ResizeBar from './resize-bar.jsx';
import IncrementableInput from './incrementable-input.jsx';
import AestheticLines from '$components/aesthetic-lines.jsx';
import SystemComms from '$components/system-comms.jsx';
import SystemElements from '$components/system-elements.jsx';
import SystemInput from '$components/system-input.jsx';
import SystemFrames from '$components/system-frames.jsx';
import SystemVideoInfo from '$components/system-video-info.jsx';
import SystemWorkspace from '$components/system-workspace.jsx';
import SystemMessage from '$components/system-message.jsx';

import ArrowDown from '$icons/arrow-down.svg';
import Cancel from '$icons/cancel.svg';
import MediaPlay from '$icons/media-play.svg';
import Refresh from '$icons/refresh.svg';

function isVideoValid (videoElement) {
  const duration = Math.max(0, videoElement.duration) || 0

  return (duration > 0);
}

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

  const videoRef = useRef(null);
  const widthRef = useRef(null);
  const widthBarRef = useRef(null);
  const heightRef = useRef(null);
  const heightBarRef = useRef(null);
  const timeBarRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const formRef = useRef(null);
  const contextRef = useRef(state.context);
  const formAnim = !state.matches('configuring') ? 'hidden' : 'shown';

  // set a reference to the state machine's context for use in other callbacks
  useEffect(() => {
    contextRef.current = state.context;
  }, [state.context]);

  // select the video and tell the machine we're ready to go
  useEffect(() => {
    const videoElements = document.querySelectorAll('video') || [];
    const closestVideo = findClosestElement(videoElements);

    videoRef.current = closestVideo;
  
    if (!closestVideo) {
      send('CRITICAL_ERROR', {
        title: 'No Video Found',
        message: <>GIFit <strong>couldn't find a video</strong> to work with. Try watching some of the <strong>video</strong>, and starting GIFit again.</>
      });
      return;
    }

    if (!isVideoValid(videoRef.current)) {
      send('CRITICAL_ERROR', {
        title: 'Video not valid',
        message: <>The current video is <strong>invalid</strong>. This usually means it doesn't have a <strong>src or duration</strong>. Try pressing the play button & starting GIFit again.</>
      });
      return;
    }

    send('INITIALIZE_COMPLETE', {
      videoElement: videoRef.current
    });

    return () => {
      videoRef.current.currentTime = contextRef.current.originalTime || 0;
    };
  }, []);

  // TODO don't seek on initial open
  // scrub the video to the start timecode when it changes
  useEffect(() => {
    if (state.context.videoElement && (state.matches('configuring') || state.matches('generating'))) {
      state.context.videoElement.currentTime = state.context.start;
    }
  }, [state.context.start]);

  // scrub the video to the end timecode when it changes
  useEffect(() => {
    if (state.context.videoElement && (state.matches('configuring') || state.matches('generating'))) {
      state.context.videoElement.currentTime = state.context.end;
    }
  }, [state.context.end]);

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
    return <SystemMessage title="Initializing">Initializing</SystemMessage>;
  }

  if (state.matches('criticalError')) {
    return (
      <SystemMessage
        title={state.context.criticalError.title}
        type="error">
        {state.context.criticalError.message}
      </SystemMessage>
    );
  }

  let submitButtonContents = [];

  if (state.matches('configuring')) {
    submitButtonContents = ['Generate GIF', <MediaPlay />];
  } else if (state.matches('generating') && !state.matches({ generating: { generatingGif: 'succeeded' }})) {
    submitButtonContents = ['Cancel', <Cancel />];
  } else if (state.matches({ generating: { generatingGif: 'succeeded' }})) {
    submitButtonContents = ['Reset', <Refresh />];
  }

  const gifUrl = state?.context?.gifData?.blob ? URL.createObjectURL(state.context.gifData.blob) : null;

  return (
    <motion.div
      className={css.ggs}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', delay: 0.25, stiffness: 300, damping: 50, tension: 500 }}>

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
          <ResizeBar 
            value={state.context.width}
            onChange={handleWidthControlBarChange}
            disabled={!state.matches('configuring')} />
        </motion.div>

        <motion.div
          className={css.videoInfo}
          custom={1}
          animate={formAnim}
          variants={animVariants}>
          <SystemVideoInfo video={state.context.videoElement} gifUrl={gifUrl} />
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
              <input
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
              <input
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
            <ResizeBar
              orientation="vertical"
              value={state.context.height}
              onChange={handleHeightControlBarChange}
              disabled={!state.matches('configuring')} />
          </div>
        </motion.div>
        
        <div className={css.workspace}>
          <SystemWorkspace
            videoElement={state.context.videoElement}
            width={state.context.width}
            height={state.context.height}
            gifUrl={gifUrl}
            isGenerating={state.matches('generating')}
            isComplete={state.matches({ generating: { generatingGif: 'succeeded' }})} />
        </div>

        <motion.div
          className={css.qualityAndFrameRate}
          custom={3}
          animate={formAnim}
          variants={animVariants}>
          <SystemInput
            name="Quality">
            <input
              type="number"
              value={state.context.quality}
              onChange={handleQualityInputChange}
              disabled={!state.matches('configuring')} />
          </SystemInput>
          <SystemInput
            name="Frame Rate"
            addendum="fps">
            <input
              type="number"
              value={state.context.fps}
              onChange={handleFrameRateInputChange}
              disabled={!state.matches('configuring')} />
          </SystemInput>
        </motion.div>

        <div className={css.startAndEnd}>
          <motion.div
            className={css.timeBar}
            custom={4}
            animate={formAnim}
            variants={animVariants}
            ref={timeBarRef}>
            <ControlBar
              startValue={state.context.start / videoRef.current.duration}
              endValue={state.context.end / videoRef.current.duration}
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
                increment={1 / state.context.fps}
                min={0}
                max={state.context.end}
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
                increment={1 / state.context.fps}
                min={state.context.start}
                max={videoRef.current.duration}
                width="200px"
                onChange={handleEndInputChange}
                disabled={!state.matches('configuring')} />
            </SystemInput>
          </motion.div>
        </div>

        <footer className={css.footer}>
          <motion.div
            className={css.actions}
            initial={{ translateY: '0px' }}
            animate={{
              translateY: state.matches({ generating: { generatingGif: 'succeeded' }}) ? '-45px' : '0px'
            }}
            transition={{ type: 'spring', tension: 2550, damping: 10, mass: 0.25, delay: 0.25 }}>
            <span className={css.action}>
              <Button
                type="submit"
                icon={submitButtonContents[1]}>
                {submitButtonContents[0]}
              </Button>
            </span>
            <a
              className={css.action}
              href={gifUrl}
              download={`gifit_${Date.now()}.gif`}>
              <Button
                type="button"
                icon={<ArrowDown />}
                disabled={!state.matches({ generating: { generatingGif: 'succeeded' }})}>
                Save GIF
              </Button>
            </a>
          </motion.div>
        </footer>

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

export default GifGenerationSystem;
