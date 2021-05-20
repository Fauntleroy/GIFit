import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as css from './system-input.module.css';

const SystemInput = React.forwardRef((props, ref) => {
  const { addendum, children, className, name, ...passthroughProps } = props;

  return (
    <label className={cx(css.systemInput, className)} ref={ref} {...passthroughProps}>
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
  className: PropTypes.string,
  name: PropTypes.string,
  addendum: PropTypes.node
};

SystemInput.defaultProps = {
  className: '',
  name: null,
  addendum: null
};

export default SystemInput;
