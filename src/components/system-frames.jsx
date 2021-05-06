import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import * as css from './system-frames.module.css';

function SystemFrames (props) {
  const { frameCount } = props;

  return (
    <div className={css.frames}>
      {_.times(frameCount, (i) => (
        <span key={i} className={css.frame} />
      ))}
      <span className={css.count}>{frameCount}</span>
    </div>
  );
}

SystemFrames.defaultProps = {
  frameCount: 0
};

SystemFrames.propTypes = {
  frameCount: PropTypes.number
};

export default SystemFrames;
