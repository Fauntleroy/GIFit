import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';
import { useMachine } from '@xstate/react';

import createControlBarMachine from '../state-machines/create-control-bar-machine';

const controlBarClassName = css`
  position: relative;
  height: 12px;
  width: 100%;
  cursor: pointer;

  .total {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
  }
  
  .start,
  .end {
    position: absolute;
    padding: 0;
    width: 3px;
    height: 12px;

    &:before {
      content: '';
      position: absolute;
      top: -4px;
      right: -4px;
      bottom: -4px;
      left: -4px;
    }
  }

  .start {
    bottom: 0;
    left: 0;
  }

  .end {
    bottom: 0;
    left: 0;
  }

  .range {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: white;
  }

  .start,
  .end,
  .range {
    transition: transform 250ms;
  }
`;

function getPosition (controlBarElement, event) {
  const { left, width } = controlBarElement.getBoundingClientRect();
  const position = (event.clientX - left) / width;

  return position;
}

function ControlBar (props) {
  const controlBarMachine = createControlBarMachine({
    id: 'width',
    start: props.startValue,
    end: props.endValue
  });
  const [state, send] = useMachine(controlBarMachine);
  const controlBarRef = useRef(null);

  function handleMouseDown (event) {
    const position = getPosition(controlBarRef.current, event);
    send('START', {
      position,
      precise: event.shiftKey
    });
  }

  const handleMouseMove = _.throttle(function (event) {
    const position = getPosition(controlBarRef.current, event);
    send('SLIDE', { position, precise: event.shiftKey });
  }, 1000 / 120);

  function handleMouseUp (event) {
    const position = getPosition(controlBarRef.current, event);
    send('END', { position, precise: event.shiftKey });
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    props.onChange({ start: state.context.start, end: state.context.end, changed: 'start' });
  }, [state.context.start]);

  useEffect(() => {
    props.onChange({ start: state.context.start, end: state.context.end, changed: 'end' });
  }, [state.context.end]);

  useEffect(() => {
    send('VALUE', { start: props.startValue, end: props.endValue });
  }, [props.startValue, props.endValue]);

  useEffect(() => {
    if (props.disabled) {
      send('DISABLE');
    } else {
      send('ENABLE');
    }
  }, [props.disabled]);

  return (
    <div className={controlBarClassName} onMouseDown={handleMouseDown} ref={controlBarRef}>
      <div className="total" />
      <button className="start" type="button" style={{ left: `${state.context.start * 100}%` }} />
      <span className="range" style={{
        left: `${state.context.start * 100}%`,
        right: `${(1 - state.context.end) * 100}%`
      }} />
      <button className="end" type="button" style={{ left: `${state.context.end * 100}%` }} />
    </div>
  );
}

ControlBar.propTypes = {
  startValue: PropTypes.number.isRequired,
  endValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ControlBar.defaultProps = {
  disabled: false
};

export default ControlBar;
