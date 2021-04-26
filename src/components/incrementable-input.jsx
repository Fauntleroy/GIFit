import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';

const incrementableInputClassName = css`
  display: flex;
  align-items: center;
  position: relative;

  .decrementor,
  .incrementor {
    padding: 5px;
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
        -
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
        +
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
