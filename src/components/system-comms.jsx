import _ from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import { AnimatePresence, motion } from 'framer-motion';

import * as css from './system-comms.module.css';
import systemCommsMachine from '$machines/system-comms';

const IDLE_PHRASES = [
  'System ready',
  'Good to go',
  'Ready to GIF',
  'Ready to go',
  'Down to GIF',
  'Awaiting instructions',
  `Let's do this`
];

const COMPLETE_PHRASES = [
  'GIF created successfully',
  'GIF complete',
  'GIF ready',
  'You did great',
  `You're doing great`,
  `Let's GIF again`,
  `GIF is done`,
  'It is finished'
];

function SystemComms (props) {
  const [state, send] = useMachine(systemCommsMachine);
  const { ggsState } = props;

  useEffect(() => {
    switch (ggsState.event.type) {
      case 'INITIALIZE_COMPLETE':
      case 'ABORT':
      case 'RESET':
        send('MESSAGE', { text: _.sample(IDLE_PHRASES) });
        break;
      case 'FRAMES_PROGRESS':
        send('MESSAGE', { text: `Collating frames` });
        break;
      case 'GENERATION_SUCCESS':
        send('MESSAGE', { text: _.sample(COMPLETE_PHRASES) });
        break;
      default:
        break;
    }
  }, [ggsState]);

  return (
    <div className={css.comms}>
      <AnimatePresence>
        <motion.div
          className={css.message}
          key={state.context.message}
          initial={{ y: '50px', opacity: 0 }}
          animate={{ y: '0px', opacity: 1 }}
          exit={{ y: '-50px', opacity: 0 }}
          transition={{ type: 'spring', tension: 75, damping: 7, mass: 0.25, delay: 0.15 }}>
          {state.context.message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

SystemComms.propTypes = {
  ggsState: PropTypes.object.isRequired
};

export default SystemComms;
