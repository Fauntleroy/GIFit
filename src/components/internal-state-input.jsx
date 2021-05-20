import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function InternalStateInput ({
  onChange, value,
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
    <input
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props} />
  );
}

InternalStateInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default InternalStateInput;
