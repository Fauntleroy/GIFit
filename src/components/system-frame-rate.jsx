import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import useFrameRate from '$hooks/use-frame-rate';

import * as css from './system-frame-rate.module.css';

function SystemFrameRate (props) {
  const { fps } = props;
  const [frame] = useFrameRate({ fps });
  const activeFrame = frame % fps;

  return (
    <div className={css.frameRate}>
      {_.times(fps, (iteration) => {
        return (
          <span
            className={css.frame}
            style={{
              transform: `translateY(${(iteration === activeFrame ? '-5px' : '0px' )})`
            }}
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
