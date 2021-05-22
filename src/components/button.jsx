import React from 'react';
import PropTypes from 'prop-types';

import * as css from './button.module.css';

function Button ({ type, children, icon, ...props }) {
  return (
    <button
      className={css.button}
      type={type}
      {...props}>
      <span className={css.children}>
        {children}
      </span>
      {icon &&
      <span className={css.icon}>
        {icon}
      </span>
      }
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  type: PropTypes.oneOf(['submit', 'reset', 'button'])
};

Button.defaultProps = {
  icon: null,
  type: 'button'
};

export default Button;
