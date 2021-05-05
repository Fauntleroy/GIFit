import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '$components/button.jsx';
import GifGenerationSystem from '$components/gif-generation-system.jsx';

import Times from '$icons/times.svg';

const gifitBackdropClassName = css`
  position: fixed;
  z-index: 5000000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateZ(-500px);

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--color-nightshade);
`;

const gifitAppClassName = css`
  position: fixed;
  z-index: 5000001;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: Inter, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 3px;
  color: white;

  .actions {
    position: absolute;
    top: 30px;
    right: 30px;
  }
`;

function GifitApp (props) {
  function handleCloseClick (event) {
    event.preventDefault();
    props.onClose();
  }

  return (
    <AnimatePresence>
      {props.active &&
      <>
        <motion.div
          className={cx(gifitBackdropClassName, 'gifit-backdrop')}
          initial={{ opacity: 0, transform: 'scale(0.75)' }}
          animate={{ opacity: 1, transform: 'scale(1)' }}
          exit={{ opacity: 0, transform: 'scale(0.925)' }}
          transition={{ type: 'spring', damping: 45, stiffness: 500 }}
          key="gifit-backdrop" />
        <motion.div
          className={cx(gifitAppClassName, 'gifit-app')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', damping: 45, stiffness: 500 }}
          key="gifit-app">
          <div className="actions">
            <Button
              type="button"
              onClick={handleCloseClick}
              icon={<Times />}>
              Close GIFit
            </Button>
          </div>
          <GifGenerationSystem />
        </motion.div>
      </>}
    </AnimatePresence>
  );
}

GifitApp.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

GifitApp.defaultProps = {
  active: false
};

export default GifitApp;
