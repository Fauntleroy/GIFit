import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { AnimateSharedLayout, motion } from 'framer-motion';

import * as css from './system-frames.module.css';

const MAX_VISIBLE_FRAMES = 100;
const PRIMARY_SYSTEM_COLOR = 'rgb(231, 231, 253)'; // framer can't read my css var?
const ACTIVE_COLOR = 'rgba(65, 255, 193, 1)';
const SUBSYSTEM_COLOR = 'rgba(153, 179, 255, 0.35)';

function SystemFrames (props) {
  const { state } = props;
  const frameCount = Math.ceil((state.context.end - state.context.start) * state.context.fps);
  const { framesComplete } = state.context;
  const framesIncomplete = frameCount - framesComplete;
  const incompleteRatio = framesIncomplete / frameCount;
  const completeRatio = 1 - incompleteRatio;
  const totalCount = Math.min(MAX_VISIBLE_FRAMES, frameCount);
  const incompleteCount = Math.floor(totalCount * incompleteRatio);
  const completeCount = Math.ceil(totalCount * completeRatio);
  const isGenerating = state.matches('generating');
  const isCompleted = state.matches({ generating: { generatingGif: 'succeeded' }});

  return (
    <motion.div
      className={css.frames}>
      <AnimateSharedLayout>
        <motion.div
          className={css.pending}
          animate={{
            color: isGenerating ? PRIMARY_SYSTEM_COLOR : SUBSYSTEM_COLOR
          }}
          layout={true}>
          {_.times(incompleteCount, (i) => (
            <motion.span
              className={css.frame}
              key={i}
              layout={true}
              layoutId={i} />
          ))}
          <span className={css.count}>{framesIncomplete}</span>
        </motion.div>
        {(isGenerating && !isCompleted) &&
        <motion.div
          className={css.complete}
          animate={{
            color: !isCompleted ? ACTIVE_COLOR : PRIMARY_SYSTEM_COLOR
          }}
          layout={true}>
          {_.times(completeCount, (i) => (
            <motion.span
              className={`${css.frame} ${css.frameComplete}`}
              key={(totalCount - i) - 1}
              style={{ width: `${100 / totalCount}%` }}
              layout={true}
              layoutId={(totalCount - i) - 1} />
          ))}
          <span className={`${css.count} ${css.countComplete}`}>
            <var className={css.total}>{frameCount}</var> ︱ {framesComplete}
          </span>
        </motion.div>
        }
      </AnimateSharedLayout>
    </motion.div>
  );
}

SystemFrames.propTypes = {
  state: PropTypes.object.isRequired
};

export default SystemFrames;
