import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ChevronLeft from '$icons/chevron-left.svg';
import ChevronRight from '$icons/chevron-right.svg';

import * as css from './incrementable-input.module.css';

function IncrementableInput ({
  increment, onChange, value, min, max, width, disabled,
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const valueRef = useRef(value);
  const internalValueRef = useRef(internalValue);

  useEffect(() => {
    valueRef.current = value;

    if (!isActive) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    internalValueRef.current = internalValue;
  }, [internalValue]);

  let incrementIntervalId;
  let incrementTimeoutId;

  function decrementValue () {
    const newValue = _.round(Math.max(min, (internalValueRef.current - increment)), 2);
    setInternalValue(newValue);
    onChange(newValue);
  }

  function incrementValue () {
    const newValue = _.round(Math.min(max, (internalValueRef.current + increment)), 2);
    setInternalValue(newValue);
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
    }, 375);
  }

  const externalOnChangeDebounced = _.debounce(onChange, 500);

  function handleChange (event) {
    setInternalValue(event.target.value);
    externalOnChangeDebounced(...arguments);
  }

  function handleFocus () {
    setIsActive(true);
  }

  function handleBlur () {
    setIsActive(false);
    setInternalValue(valueRef.current);
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
        value={internalValue}
        style={{
          width: width
        }}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        {...props} />
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
