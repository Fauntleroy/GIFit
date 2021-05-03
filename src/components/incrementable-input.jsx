import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';

import ChevronLeft from '$icons/chevron-left.svg';
import ChevronRight from '$icons/chevron-right.svg';

const incrementableInputClassName = css`
  display: flex;
  align-items: center;
  position: relative;

  .input[type="text"] {
    padding-left: 30px;
    padding-right: 30px;
  }

  .decrementor,
  .incrementor {
    display: flex;
    position: absolute;
    padding: 7px 1px;
    color: currentColor;
    z-index: 1;
    background: transparent;

    &:hover {
      background: transparent;
    }
  }

  .decrementor {
    left: 0;
  }

  .incrementor {
    right: 0;
  }
`;

function IncrementableInput ({
  increment, onChange, value, min, max, width, disabled,
  ...passthroughProps
}) {
  function handleIncrement () {
    const newValue = Math.min(max, (value + increment));
    onChange(newValue);
  }

  function handleDecrement () {
    const newValue = Math.max(min, (value - increment));
    onChange(newValue);
  }

  return (
    <span className={incrementableInputClassName}>
      <button
        className="decrementor"
        type="button"
        onClick={handleDecrement}
        disabled={disabled}>
        <ChevronLeft style={{ width: '14px' }} />
      </button>
      <input
        className="input"
        type="text"
        inputMode="numeric"
        value={value}
        style={{
          width: width
        }}
        onChange={onChange}
        disabled={disabled}
        {...passthroughProps} />
      <button
        className="incrementor"
        type="button"
        onClick={handleIncrement}
        disabled={disabled}>
        <ChevronRight style={{ width: '14px' }} />
      </button>
    </span>
  );
}

IncrementableInput.propTypes = {
  increment: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  width: PropTypes.string,
  disabled: PropTypes.bool
};

IncrementableInput.defaultProps = {
  increment: 1,
  min: 0,
  max: Infinity,
  width: '100px',
  disabled: false
};

export default IncrementableInput;
