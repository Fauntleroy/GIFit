import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import useFrameRate from '$hooks/use-frame-rate';

import * as css from './system-frame-rate.module.css';

const frameVariants = {
  active: () => ({
    opacity: 1,
    transition: {
      type: 'spring',
      tension: 1000,
      damping: 0,
      mass: 0.5
    }
  }),
  inactive: () => ({
    opacity: 0.075,
    transition: {
      type: 'spring',
      tension: 750,
      damping: 25,
      mass: 2
    }
  })
};

function SystemFrameRate (props) {
  const { fps } = props;
  const [frame] = useFrameRate({ fps });
  const activeFrame = frame % fps;

  return (
    <div className={css.frameRate}>
      {_.times(fps, (iteration) => {
        return (
          <motion.span
            className={css.frame}
            variants={frameVariants}
            initial="inactive"
            animate={iteration === activeFrame ? 'active' : 'inactive'}
            key={iteration} />
        );
      })}
    </div>
  );
}

SystemFrameRate.propTypes = {
  fps: PropTypes.number.isRequired
};

export default SystemFrameRate;
