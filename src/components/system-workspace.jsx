import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { AnimatePresence, motion } from 'framer-motion';

import * as css from './system-workspace.module.css';

function SystemWorkspace (props) {
  const { state } = props;

  const canvasRef = useRef(null);
  const contextRef = useRef(state.context);

  // draw the video to the preview canvas
  function drawFrame () {
    if (canvasRef.current && contextRef.current.videoElement) {
      const context = canvasRef.current.getContext('2d');
      const { videoElement, width, height } = contextRef.current;

      context.drawImage(
        videoElement,
        0, 0, videoElement.videoWidth, videoElement.videoHeight,
        0, 0, width, height
      );
    }
  }

  const debouncedDrawFrame = _.debounce(drawFrame, 375);

  useEffect(() => {
    debouncedDrawFrame();
  }, [state.context.width, state.context.height, state.context.gifData]);

  useEffect(() => {
    state.context.videoElement.pause();
    state.context.videoElement.addEventListener('seeked', drawFrame);

    return () => {
      state.context.videoElement.removeEventListener('seeked', drawFrame);
    };
  }, [state.context.videoElement]);

  useEffect(() => {
    contextRef.current = state.context;
  }, [state.context]);

  return (
    <motion.div
      className={css.workspace}
      animate={{
        translateY: state.matches('generating') ? '35px' : '0px'
      }}
      transition={{ type: 'spring', tension: 2550, damping: 10, mass: 0.25, delay: 0.25 }}>
      <AnimatePresence>
        {state.matches({ generating: { generatingGif: 'succeeded' }}) &&
        <motion.img
          className={css.result}
          src={props.gifUrl}
          initial={{ translateZ: '0px', filter: 'drop-shadow(rgba(0,0,0,0) 0 0px 0px)' }}
          animate={{ translateZ: '50px', filter: 'drop-shadow(rgba(0,0,0,0.35) 0 10px 25px)' }}
          exit={{ translateZ: '0px', filter: 'drop-shadow(rgba(0,0,0,0) 0 0px 0px)' }}
          transition={{ type: 'spring', tension: 2550, damping: 10, mass: 0.2, delay: 0.25 }}
          key="generated-gif" />}
        {!state.matches({ generating: { generatingGif: 'succeeded' }}) &&
        <motion.canvas
          className={css.canvas}
          ref={canvasRef}
          style={{ willChange: 'width, height' }}
          initial={{ width: state.context.width, height: state.context.height }}
          animate={{ width: state.context.width, height: state.context.height }}
          transition={{ type: 'spring', bounce: 0, delay: 0.75 }}
          height={state.context.height}
          width={state.context.width} />}
      </AnimatePresence>
    </motion.div>
  );
}

SystemWorkspace.defaultProps = {
  gifUrl: null
};

SystemWorkspace.propTypes = {
  gifUrl: PropTypes.object,
  state: PropTypes.object.isRequired
};

export default SystemWorkspace;
