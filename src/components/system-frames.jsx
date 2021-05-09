import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { AnimateSharedLayout, motion } from 'framer-motion';

import * as css from './system-frames.module.css';

function SystemFrames (props) {
  const { state } = props;
  const frameCount = Math.floor((state.context.end - state.context.start) * state.context.fps);
  const { framesComplete } = state.context;
  const framesIncomplete = frameCount - framesComplete;

  return (
    <div
      className={css.frames}>
      <AnimateSharedLayout>
        <motion.div
          className={css.pending}
          layout={true}>
          {_.times(framesIncomplete, (i) => (
            <motion.span
              className={css.frame}
              key={i}
              layout={true}
              layoutId={i} />
          ))}
          <span className={css.count}>{framesIncomplete}</span>
        </motion.div>
        {state.matches('generating') &&
        <motion.div
          className={css.complete}
          layout={true}>
          {_.times(framesComplete, (i) => (
            <motion.span
              className={`${css.frame} ${css.frameComplete}`}
              key={(frameCount - i) - 1}
              layout={true}
              layoutId={(frameCount - i) - 1} />
          )).reverse()}
          <span className={`${css.count} ${css.countComplete}`}>{framesComplete}</span>
        </motion.div>
        }
      </AnimateSharedLayout>
    </div>
  );
}

SystemFrames.propTypes = {
  state: PropTypes.object.isRequired
};

export default SystemFrames;
