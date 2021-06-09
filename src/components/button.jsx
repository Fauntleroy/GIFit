import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import * as css from './button.module.css';

const Button = forwardRef(({ type, children, icon, ...props }, ref) => {
  return (
    <button
      className={css.button}
      type={type}
      ref={ref}
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
});

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
