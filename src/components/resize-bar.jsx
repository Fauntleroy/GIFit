import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import * as css from './resize-bar.module.css';
import createResizeBarMachine from '../state-machines/create-resize-bar-machine';

function getPosition (x, y, orientation) {
  return (orientation === 'horizontal') ? x : y;
}

function ResizeBar (props) {
  const resizeBarMachine = createResizeBarMachine({
    id: 'width',
    initialSize: props.value,
    minimumSize: props.minimum
  });
  const [state, send] = useMachine(resizeBarMachine);
  const controlBarRef = useRef(null);

  const handleMouseMove = _.throttle(function (event) {
    const position = getPosition(event.clientX, event.clientY, props.orientation);
    send('SLIDE', {
      position,
      precise: event.shiftKey
    });
  }, 1000 / 120);

  function handleMouseUp (event) {
    const position = getPosition(event.clientX, event.clientY, props.orientation);
    send('END', {
      position,
      precise: event.shiftKey
    });

    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseDown (event) {
    const position = getPosition(event.clientX, event.clientY, props.orientation);
    send('START', {
      initialSize: props.value,
      position,
      handle: event.target.dataset.handle,
      precise: event.shiftKey
    });

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
  }

  useEffect(() => {
    props.onChange({
      scale: state.context.scale,
      size: state.context.size
    });
  }, [state.context.scale]);

  useEffect(() => {
    send('VALUE', {
      initialSize: props.value,
      scale: 1
    });
  }, [props.value]);

  useEffect(() => {
    if (props.disabled) {
      send('DISABLE');
    } else {
      send('ENABLE');
    }
  }, [props.disabled]);

  let barWidth, barHeight, handleWidth, handleHeight, startPosition, endPosition, rangeStyle;
  if (props.orientation === 'horizontal') {
    barWidth = '100%';
    barHeight = '12px';
    handleWidth = '3px';
    handleHeight = '12px';
    startPosition = { top: 0, left: 0 };
    endPosition = { top: 0, right: 0 };
    rangeStyle = { left: 0, right: 0, height: '2px' };
  } else {
    barWidth = '12px';
    barHeight = '100%';
    handleWidth = '12px';
    handleHeight = '3px';
    startPosition = { top: 0, left: 0 };
    endPosition = { bottom: 0, left: 0 };
    rangeStyle = { top: 0, bottom: 0, width: '2px' };
  }

  return (
    <div
      className={css.resizeBar}
      style={{ width: barWidth, height: barHeight }}
      ref={controlBarRef}>
      <div className={css.total} />
      <button
        className={css.start}
        style={{ width: handleWidth, height: handleHeight, ...startPosition }}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="start" />
      <span className={css.range} style={{ ...rangeStyle }} />
      <button
        className={css.end}
        style={{ width: handleWidth, height: handleHeight, ...endPosition }}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="end" />
    </div>
  );
}

ResizeBar.propTypes = {
  value: PropTypes.number.isRequired,
  minimum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

ResizeBar.defaultProps = {
  disabled: false,
  minimum: 10,
  orientation: 'horizontal'
};

export default ResizeBar;
