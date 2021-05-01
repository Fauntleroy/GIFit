import _, { range } from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';
import { useMachine } from '@xstate/react';

import createResizeBarMachine from '../state-machines/create-resize-bar-machine';

function generateResizeBarClassName (props) {
  const { orientation } = props;
  let barWidth, barHeight, handleWidth, handleHeight, startPosition, endPosition, rangeDimensions;
  if (orientation === 'horizontal') {
    barWidth = '100%';
    barHeight = '12px';
    handleWidth = '3px';
    handleHeight = '12px';
    startPosition = 'top: 0; left: 0;';
    endPosition = 'top: 0; right: 0;';
    rangeDimensions = 'height: 2px;';
  } else {
    barWidth = '12px';
    barHeight = '100%';
    handleWidth = '12px';
    handleHeight = '3px';
    startPosition = 'top: 0; left: 0;';
    endPosition = 'bottom: 0; left: 0;';
    rangeDimensions = 'width: 2px;';
  }

  const resizeBarClassName = css`
    position: relative;
    height: ${barHeight};
    width: ${barWidth};
    cursor: pointer;
    user-select: none;

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
      z-index: 1;
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
      ${rangeDimensions}
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

function getPosition (x, y, orientation) {
  return (orientation === 'horizontal') ? x : y;
}

function ControlBar (props) {
  const resizeBarClassName = generateResizeBarClassName(props);
  const resizeBarMachine = createResizeBarMachine({
    id: 'width',
    initialSize: props.value,
    minimumSize: props.minimum
  });
  const [state, send] = useMachine(resizeBarMachine);
  const controlBarRef = useRef(null);

  function handleMouseDown (event) {
    const position = getPosition(event.clientX, event.clientY, props.orientation);
    send('START', {
      initialSize: props.value,
      position,
      handle: event.target.dataset.handle,
      precise: event.shiftKey
    });
  }

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
  minimum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  orientation: PropTypes.oneOf('horizontal', 'vertical')
};

ControlBar.defaultProps = {
  disabled: false,
  minimum: 10,
  orientation: 'horizontal'
};

export default ControlBar;
