import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMachine } from '@xstate/react';

import gifitAppMachine from '$machines/gifit-app-machine';
import usePrevious from '$hooks/use-previous';

import Button from '$components/button.jsx';
import GifGenerationSystem from '$components/gif-generation-system.jsx';
import CriticalErrorSystem from '$components/critical-error-system.jsx';

import Times from '$icons/times.svg';

import * as css from './gifit-app.module.css';
import './gifit-app-fonts.module.css';

function GifitApp (props) {
  const [state, send] = useMachine(gifitAppMachine);
  const videoRef = useRef(state.context.currentVideo);
  const previousActive = usePrevious(props.active);

  useEffect(() => {
    if (!previousActive && props.active) {
      send('INITIALIZE');
    } else if (previousActive && !props.active) {
      send('CLOSE');
    }
  }, [props.active]);

  useEffect(() => {
    videoRef.current = state.context.currentVideo;
  }, [state.context.currentVideo]);

  function handleCloseClick () {
    props.onClose();

    videoRef.current.currentTime = state.context.originalTime;
  }

  return (
    <AnimatePresence>
      {!state.matches('closed') &&
      <>
        <motion.div
          className={css.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', damping: 45, stiffness: 500 }}
          key="gifit-backdrop" />
        <motion.div
          className={css.app}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', damping: 45, stiffness: 500 }}
          key="gifit-app">
          <div className={css.actions}>
            <Button
              type="button"
              onClick={handleCloseClick}
              icon={<Times />}>
              Close GIFit
            </Button>
          </div>
          {state.matches('criticalError') && <CriticalErrorSystem error={state.context.criticalError} />}
          {state.matches('initialized') && <GifGenerationSystem currentVideo={state.context.currentVideo} />}
        </motion.div>
      </>
      }
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
