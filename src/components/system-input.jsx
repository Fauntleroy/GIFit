import React from 'react';
import PropTypes from 'prop-types';

import * as css from './system-input.module.css';

const SystemInput = React.forwardRef((props, ref) => {
  const { addendum, children, name, ...passthroughProps } = props;

  return (
    <label className={css.systemInput} ref={ref} {...passthroughProps}>
      {name && <span className={css.name}>{name}</span>}
      <div className={css.inputContainer}>
        {children}
        {addendum && <span className={css.addendum}>{addendum}</span>}
      </div>
    </label>
  );
});

SystemInput.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
  addendum: PropTypes.string
};

SystemInput.defaultProps = {
  name: null,
  addendum: null
};

export default SystemInput;
