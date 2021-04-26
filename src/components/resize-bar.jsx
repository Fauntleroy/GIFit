import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';
import { useMachine } from '@xstate/react';

import createResizeBarMachine from '../state-machines/create-resize-bar-machine';

function generateResizeBarClassName (props) {
  const { orientation } = props;
  let barWidth, barHeight, handleWidth, handleHeight, startPosition, endPosition;
  if (orientation === 'horizontal') {
    barWidth = '100%';
    barHeight = '12px';
    handleWidth = '3px';
    handleHeight = '12px';
    startPosition = 'top: 0; left: 0;';
    endPosition = 'top: 0; right: 0;';
  } else {
    barWidth = '12px';
    barHeight = '100%';
    handleWidth = '12px';
    handleHeight = '2px';
    startPosition = 'top: 0; left: 0;';
    endPosition = 'bottom: 0; left: 0;';
  }

  const resizeBarClassName = css`
    position: relative;
    height: ${barHeight};
    width: ${barWidth};
    cursor: pointer;

    .total {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.5);
    }
    
    .start,
    .end {
      position: absolute;
      padding: 0;
      width: ${handleWidth};
      height: ${handleHeight};

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
      ${startPosition};
    }

    .end {
      ${endPosition};
    }

    .range {
      position: absolute;
      top: 0;
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

  return resizeBarClassName;
}

function getPosition (controlBarElement, event, orientation) {
  const rect = controlBarElement.getBoundingClientRect();
  const position = (orientation === 'horizontal')
    ? (event.clientX - rect.left) / rect.width
    : (event.clientY - rect.top) / rect.height;

  return position;
}

function ControlBar (props) {
  const resizeBarClassName = generateResizeBarClassName(props);
  const resizeBarMachine = createResizeBarMachine({
    id: 'width',
    initialSize: props.value
  });
  const [state, send] = useMachine(resizeBarMachine);
  const controlBarRef = useRef(null);

  function handleMouseDown (event) {
    console.log('et', event.target);
    const position = getPosition(controlBarRef.current, event, props.orientation);
    send('START', {
      position,
      handle: event.target.dataset.handle,
      precise: event.shiftKey
    });
  }

  const handleMouseMove = _.throttle(function (event) {
    const position = getPosition(controlBarRef.current, event, props.orientation);
    send('SLIDE', { position, precise: event.shiftKey });
  }, 1000 / 120);

  function handleMouseUp (event) {
    const position = getPosition(controlBarRef.current, event, props.orientation);
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
    props.onChange({
      scale: state.context.scale,
      size: state.context.scale * state.context.initialSize
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

  const rangeStyle = (props.orientation === 'horizontal')
    ? { left: 0, right: 0, height: '2px' }
    : { top: 0, bottom: 0, width: '2px' };

  return (
    <div className={resizeBarClassName} ref={controlBarRef}>
      <div className="total" />
      <button
        className="start"
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="start" />
      <span className="range" style={rangeStyle} />
      <button
        className="end"
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="end" />
    </div>
  );
}

ControlBar.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  orientation: PropTypes.oneOf('horizontal', 'vertical')
};

ControlBar.defaultProps = {
  disabled: false,
  orientation: 'horizontal'
};

export default ControlBar;
