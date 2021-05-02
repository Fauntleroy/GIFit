import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const DELAY = 0.75;

function SystemElements () {
  return (
    <>
      <motion.div
        className="ggs__label"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateY(-50%) translateX(-50%)'
        }}
        animate={{ top: '0' }}
        transition={{ type: 'spring', damping: 35, delay: DELAY, stiffness: 350 }}>
        GIF Generation System
      </motion.div>

      <motion.span className="ggs__corner"
        animate={{ left: '0px', top: '0px' }}
        initial={{ left: '175px', top: '175px' }}
        transition={{ type: 'spring', damping: 35, delay: DELAY, stiffness: 350 }} />
      <motion.span className="ggs__corner"
        animate={{ right: '0px', top: '0px' }}
        initial={{ right: '175px', top: '175px' }}
        transition={{ type: 'spring', damping: 35, delay: DELAY, stiffness: 350 }} />
      <motion.span className="ggs__corner"
        animate={{ right: '0px', bottom: '0px' }}
        initial={{ right: '175px', bottom: '175px' }}
        transition={{ type: 'spring', damping: 35, delay: DELAY, stiffness: 350 }} />
      <motion.span className="ggs__corner"
        animate={{ left: '0px', bottom: '0px' }}
        initial={{ left: '175px', bottom: '175px' }}
        transition={{ type: 'spring', damping: 35, delay: DELAY, stiffness: 350 }} />
    </>
  );
}

SystemElements.propTypes = {
};

export default SystemElements;
