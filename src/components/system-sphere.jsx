import React from 'react';
import PropTypes from 'prop-types';

import * as css from './system-sphere.module.css';

function SystemSphere (props) {
  const { size } = props;

  return (
    <div className={css.container} style={{ width: `${size}px`, height: `${size}px` }}>
      <div className={css.sphere}>
        <div className={css.ring} />
        <div className={css.ring} />
        <div className={css.ring} />
      </div>
    </div>
  );
}

SystemSphere.propTypes = {
  size: PropTypes.number
};

SystemSphere.defaultProps = {
  size: 20
};

export default SystemSphere;
