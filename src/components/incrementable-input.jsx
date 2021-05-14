import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import ChevronLeft from '$icons/chevron-left.svg';
import ChevronRight from '$icons/chevron-right.svg';

import * as css from './incrementable-input.module.css';

function IncrementableInput ({
  increment, onChange, value, min, max, width, disabled,
  ...passthroughProps
}) {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  let incrementIntervalId;
  let incrementTimeoutId;

  function decrementValue () {
    const currentValue = valueRef.current;
    const newValue = Math.max(min, (currentValue - increment));
    onChange(newValue);
  }

  function incrementValue () {
    const currentValue = valueRef.current;
    const newValue = Math.min(max, (currentValue + increment));
    onChange(newValue);
  }

  function handleIncrementUp () {
    clearTimeout(incrementTimeoutId);
    clearInterval(incrementIntervalId);
  }

  function handleMouseDown (methodName) {
    const method = (methodName === 'decrement')
      ? decrementValue
      : incrementValue;

    method();

    window.addEventListener('mouseup', handleIncrementUp);

    incrementIntervalId = setTimeout(() => {
      incrementIntervalId = setInterval(method, 175);
    }, 500);
  }

  return (
    <span className={css.incrementableInput}>
      <button
        className={css.decrementor}
        type="button"
        onMouseDown={_.partial(handleMouseDown, 'decrement')}
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
        onMouseDown={_.partial(handleMouseDown, 'increment')}
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
