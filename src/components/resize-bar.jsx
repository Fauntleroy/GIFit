import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
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

  return (
    <div
      className={cx(css.resizeBar, {
        [css.resizeBarVertical]: props.orientation === 'vertical'
      })}
      ref={controlBarRef}>
      <div className={css.total} />
      <button
        className={css.start}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="start" />
      <span className={css.range} />
      <button
        className={css.end}
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
