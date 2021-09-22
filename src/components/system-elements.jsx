import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import SystemSphere from './system-sphere.jsx';

import * as css from './system-elements.module.css';

const DELAY = 0.75;
const ACTIVE_COLOR = 'rgba(65, 255, 193, 1)';

function SystemElements (props) {
  const isGenerating = props.state.matches('generating');
  const isComplete = props.state.matches({ generating: { generatingGif: 'succeeded' }});

  const currentColor = isGenerating && !isComplete
    ? ACTIVE_COLOR : undefined;
  const currentHorizontal = isGenerating && !isComplete
    ? '25px' : '15px';
  const currentVertical = isGenerating && !isComplete
    ? '25px' : '15px';

  return (
    <>
      <motion.div
        className={css.label}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateY(-150%) translateX(-50%)'
        }}
        initial={{ top: '50%' }}
        animate={{
          top: '0%',
          color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        GIF Generation System
      </motion.div>

      <motion.span className={css.corner}
        style={{ rotateZ: '-45deg' }}
        initial={{
          left: '175px', top: '175px'
        }}
        animate={{
          left: currentHorizontal, top: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        <SystemSphere size={7} />
      </motion.span>
      <motion.span className={css.corner}
        style={{ rotateZ: '45deg' }}
        initial={{
          right: '175px', top: '175px'
        }}
        animate={{
          right: currentHorizontal, top: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        <SystemSphere size={7} />
      </motion.span>
      <motion.span className={css.corner}
        style={{ rotateZ: '-45deg' }}
        initial={{
          right: '175px', bottom: '175px'
        }}
        animate={{
          right: currentHorizontal, bottom: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        <SystemSphere size={7} />
      </motion.span>
      <motion.span className={css.corner}
        style={{ rotateZ: '45deg' }}
        initial={{
          left: '175px', bottom: '175px'
        }}
        animate={{
          left: currentHorizontal, bottom: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        <SystemSphere size={7} />
      </motion.span>
    </>
  );
}

SystemElements.propTypes = {
  state: PropTypes.object.isRequired
};

export default SystemElements;
