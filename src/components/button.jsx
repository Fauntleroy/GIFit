import React from 'react';
import PropTypes from 'prop-types';

import { css, cx } from '@emotion/css';

const buttonClassName = css`
  display: inline-flex;
  justify-content: space-around;
  align-content: center;
  align-items: stretch;

  cursor: pointer;
  font-family: Inter, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 3px;
  text-decoration: none;

  min-width: 175px;
  border: none;
  border-radius: 3px;
  padding: 0;

  background: white;
  color: rgb(25, 25, 25);

  transition: all 250ms var(--ease-out-expo);

  &:hover {
    background: var(--color-highlight);
  }

  &:disabled {
    filter: contrast(0.5);
    background: var(--color-system);
    opacity: 0.75;
    transform: scale(0.95);
  }

  .children {
    flex-basis: 100%;
    padding: 7px 10px;
  }

  .button__icon {
    display: flex;
    align-content: center;
    justify-content: center;
    border-left: var(--color-shade) 1px solid;
    padding: 2px 5px;
  }
`;

function Button ({ type, children, icon, ...passthroughProps }) {
  return (
    <button
      className={buttonClassName}
      type={type}
      {...passthroughProps}>
      <span className="children">
        {children}
      </span>
      {icon &&
      <span className="button__icon">
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
