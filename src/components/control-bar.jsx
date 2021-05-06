import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import * as css from './control-bar.module.css';
import createControlBarMachine from '../state-machines/create-control-bar-machine';

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

  const handleMouseMove = _.throttle(function (event) {
    const position = getPosition(controlBarRef.current, event);
    send('SLIDE', { position, precise: event.shiftKey });
  }, 1000 / 120);

  function handleMouseUp (event) {
    const position = getPosition(controlBarRef.current, event);
    send('END', { position, precise: event.shiftKey });

    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseDown (event) {
    const position = getPosition(controlBarRef.current, event);
    send('START', {
      position,
      precise: event.shiftKey
    });

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
  }

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
    <div
      className={css.controlBar}
      onMouseDown={handleMouseDown}
      ref={controlBarRef}>
      <div className={css.total} />
      <button
        className={css.start}
        type="button" style={{ left: `${state.context.start * 100}%` }} />
      <span
        className={`${css.range} range`}
        style={{
          left: `${state.context.start * 100}%`,
          right: `${(1 - state.context.end) * 100}%`
        }} />
      <button
        className={css.end}
        type="button"
        style={{ left: `${state.context.end * 100}%` }} />
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
