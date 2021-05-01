import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';

import ChevronLeft from '$icons/chevron-left.svg';
import ChevronRight from '$icons/chevron-right.svg';

const incrementableInputClassName = css`
  display: flex;
  align-items: center;
  position: relative;

  .decrementor,
  .incrementor {
    padding: 8px 4px;
    background: transparent;
    color: white;
    z-index: 1;
  }
`;

function IncrementableInput (props) {
  function handleIncrement () {
    const newValue = Math.min(props.max, (props.value + props.increment));
    props.onChange(newValue);
  }

  function handleDecrement () {
    const newValue = Math.max(props.min, (props.value - props.increment));
    props.onChange(newValue);
  }

  return (
    <span className={incrementableInputClassName}>
      <button
        className="decrementor"
        type="button"
        onClick={handleDecrement}>
        <ChevronLeft style={{ width: '14px' }} />
      </button>
      <input
        className="input"
        type="text"
        inputMode="numeric"
        value={props.value}
        style={{
          width: props.width
        }}
        onChange={props.onChange} />
      <button
        className="incrementor"
        type="button"
        onClick={handleIncrement}>
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
  width: PropTypes.string
};

IncrementableInput.defaultProps = {
  increment: 1,
  min: 0,
  max: Infinity,
  width: '100px'
};

export default IncrementableInput;
