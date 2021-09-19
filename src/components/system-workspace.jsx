import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import extractColors from 'extract-colors';

import { AnimatePresence, motion } from 'framer-motion';

import * as css from './system-workspace.module.css';

function sortColorsByBrightness (colors) {
  return _.sortBy(colors, (color) => {
    const { red, green, blue } = color;
    return -1 * (red + green + blue);
  });
}

function SystemWorkspace (props) {
  const { videoElement, width, height, isGenerating, isComplete } = props;

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const dimensionsRef = useRef([0, 0]);
  const [isSeeking, setIsSeeking] = useState(false);
  const [vibrantColor, setVibrantColor] = useState({ red: 0, green: 0, blue: 0 });

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
    if (canvasRef.current) {
      canvasRef.current.imageSmoothingQuality = 'high';
    }
  }, [canvasRef.current]);

  function handleSeeking () {
    setIsSeeking(true);
  }

  function handleSeeked () {
    drawFrame();
    setIsSeeking(false);
  }

  useEffect(() => {
    if (!videoElement) {
      return;
    }

    videoElement.pause();
    videoElement.addEventListener('seeking', handleSeeking);
    videoElement.addEventListener('seeked', handleSeeked);

    return () => {
      videoElement.removeEventListener('seeking', handleSeeking);
      videoElement.removeEventListener('seeked', handleSeeked);
    };
  }, [videoElement]);

  useEffect(async function () {
    if (imageRef.current) {
      const colors = await extractColors(imageRef.current, { saturationImportance: 0.5 });
      const colorsByBrightness = sortColorsByBrightness(colors);
      const newVibrantColor = colorsByBrightness[0];
      setVibrantColor(newVibrantColor);
    }
  }, [props.gifUrl]);

  return (
    <motion.div
      className={css.workspace}
      initial={{
        translateY: '0px'
      }}
      animate={{
        translateY: isGenerating ? '15px' : '0px'
      }}
      transition={{ type: 'spring', damping: 10, mass: 0.25, delay: 0.75 }}>
      <motion.div
        className={css.images}
        initial={{
          translateZ: '0px',
          filter: 'drop-shadow(hsla(180, 50%, 3.9%, 0) 0px 0px 0px)',
          boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)'
        }}
        animate={{
          translateZ: isComplete ? '35px' : '0px',
          filter: isComplete
            ? 'drop-shadow(hsla(180, 50%, 3.9%, 0.65) 0px 15px 25px)'
            : 'drop-shadow(hsla(180, 50%, 3.9%, 0) 0px 0px 0px)',
          boxShadow: isComplete
            ? `0px 10px 100px rgba(${vibrantColor.red}, ${vibrantColor.green}, ${vibrantColor.blue}, 0.25)`
            : '0px 0px 0px rgba(0, 0, 0, 0)'
        }}
        transition={{
          type: 'spring', damping: 10, mass: 0.25, delay: 0.25
        }}>
        <AnimatePresence>
          {(isComplete && props.gifUrl) &&
          <img
            className={css.result}
            src={props.gifUrl}
            key="generated-gif"
            ref={imageRef} />}
          {!isComplete &&
          <motion.canvas
            className={css.canvas}
            ref={canvasRef}
            style={{ willChange: 'width, height', width, height }}
            animate={{ opacity: isSeeking && !isGenerating ? 0.5 : 1 }}
            transition={{ type: 'spring', bounce: 0, delay: 0.75, opacity: { delay: 0.5 }}}
            height={height}
            width={width} />}
          {isSeeking && !isGenerating &&
            <motion.div className={css.seekIndicator}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: ['-20px', '20px'] }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.5, x: { repeat: Infinity, repeatType: 'reverse', duration: 0.25, repeatDelay: 0.25 }}}
              key="seek-indicator" />}
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
