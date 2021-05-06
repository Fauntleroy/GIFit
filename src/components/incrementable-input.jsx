import React from 'react';
import PropTypes from 'prop-types';

import ChevronLeft from '$icons/chevron-left.svg';
import ChevronRight from '$icons/chevron-right.svg';

import * as css from './incrementable-input.module.css';

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
    <span className={css.incrementableInput}>
      <button
        className={css.decrementor}
        type="button"
        onClick={handleDecrement}
        disabled={disabled}>
        <ChevronLeft style={{ width: '14px' }} />
      </button>
      <input
        className={css.input}
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
        className={css.incrementor}
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
