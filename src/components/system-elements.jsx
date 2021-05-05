import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const DELAY = 0.75;
const ACTIVE_COLOR = 'rgba(65, 255, 193, 1)';

function SystemElements (props) {
  const currentColor = props.state.matches('generating') && !props.state.matches({ generating: { generatingGif: 'succeeded' }})
    ? ACTIVE_COLOR : undefined;
  const currentHorizontal = props.state.matches('generating') && !props.state.matches({ generating: { generatingGif: 'succeeded' }})
    ? '25px' : '0px';
  const currentVertical = props.state.matches('generating') && !props.state.matches({ generating: { generatingGif: 'succeeded' }})
    ? '25px' : '0px';

  return (
    <>
      <motion.div
        className="ggs__label"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateY(-50%) translateX(-50%)'
        }}
        initial={{ top: '50%' }}
        animate={{
          top: '0%',
          color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }}>
        GIF Generation System
      </motion.div>

      <motion.span className="ggs__corner"
        style={{ rotateZ: '-45deg' }}
        initial={{
          left: '175px', top: '175px'
        }}
        animate={{
          left: currentHorizontal, top: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }} />
      <motion.span className="ggs__corner"
        style={{ rotateZ: '45deg' }}
        initial={{
          right: '175px', top: '175px'
        }}
        animate={{
          right: currentHorizontal, top: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }} />
      <motion.span className="ggs__corner"
        style={{ rotateZ: '-45deg' }}
        initial={{
          right: '175px', bottom: '175px'
        }}
        animate={{
          right: currentHorizontal, bottom: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }} />
      <motion.span className="ggs__corner"
        style={{ rotateZ: '45deg' }}
        initial={{
          left: '175px', bottom: '175px'
        }}
        animate={{
          left: currentHorizontal, bottom: currentVertical, color: currentColor
        }}
        transition={{ type: 'spring', damping: 45, delay: DELAY, stiffness: 500 }} />
    </>
  );
}

SystemElements.propTypes = {
  state: PropTypes.object.isRequired
};

export default SystemElements;
