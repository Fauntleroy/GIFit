import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { AnimatePresence, motion } from 'framer-motion';

import * as css from './system-workspace.module.css';

function SystemWorkspace (props) {
  const { videoElement, width, height, isGenerating, isComplete } = props;

  const canvasRef = useRef(null);
  const dimensionsRef = useRef([0, 0]);

  // draw the video to the preview canvas
  function drawFrame () {
    if (canvasRef.current && videoElement) {
      const context = canvasRef.current.getContext('2d');

      context.drawImage(
        videoElement,
        0, 0, videoElement.videoWidth, videoElement.videoHeight,
        0, 0, dimensionsRef.current[0], dimensionsRef.current[1]
      );
    }
  }

  const throttledDrawFrame = _.throttle(drawFrame, 1000 / 120);

  // used to keep drawframe from being crazy
  useEffect(() => {
    dimensionsRef.current = [width, height];
  }, [width, height]);

  useEffect(() => {
    throttledDrawFrame();
  }, [width, height, isComplete]);

  useEffect(() => {
    if (!videoElement) {
      return;
    }

    videoElement.pause();
    videoElement.addEventListener('seeked', drawFrame);

    return () => {
      videoElement.removeEventListener('seeked', drawFrame);
    };
  }, [videoElement]);

  return (
    <motion.div
      className={css.workspace}
      initial={{
        translateY: '0px'
      }}
      animate={{
        translateY: isGenerating ? '15px' : '0px'
      }}
      transition={{ type: 'spring', tension: 2550, damping: 10, mass: 0.25, delay: 0.25 }}>
      <motion.div
        className={css.images}
        initial={{
          translateZ: '0px',
          filter: 'drop-shadow(hsla(180, 50%, 3.9%, 0) 0px 0px 0px)'
        }}
        animate={{
          translateZ: isComplete ? '50px' : '0px',
          filter: isComplete
            ? 'drop-shadow(hsla(180, 50%, 3.9%, 0.65) 0px 15px 25px)'
            : 'drop-shadow(hsla(180, 50%, 3.9%, 0) 0px 0px 0px)'
        }}
        transition={{ type: 'spring', tension: 2550, damping: 10, mass: 0.25, delay: 0.25 }}>
        <AnimatePresence>
          {isComplete &&
          <motion.img
            className={css.result}
            src={props.gifUrl}
            key="generated-gif" />}
          {!isComplete &&
          <motion.canvas
            className={css.canvas}
            ref={canvasRef}
            style={{ willChange: 'width, height' }}
            initial={{ width: width, height: height }}
            animate={{ width: width, height: height }}
            transition={{ type: 'spring', bounce: 0, delay: 0.75 }}
            height={height}
            width={width} />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

SystemWorkspace.defaultProps = {
  gifUrl: null,
  videoElement: null,
  isComplete: false,
  isGenerating: false
};

SystemWorkspace.propTypes = {
  gifUrl: PropTypes.string,
  videoElement: PropTypes.shape({
    videoHeight: PropTypes.number,
    videoWidth: PropTypes.number,
    pause: PropTypes.func.isRequired,
    addEventListener: PropTypes.func.isRequired,
    removeEventListener: PropTypes.func.isRequired
  }),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  isGenerating: PropTypes.bool.isRequired
};

export default SystemWorkspace;
