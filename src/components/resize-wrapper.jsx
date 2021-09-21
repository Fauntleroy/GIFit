import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useMachine } from '@xstate/react';

import * as css from './resize-wrapper.module.css';
import createResizeWrapperMachine from '../state-machines/create-resize-wrapper-machine';

function getPosition (x, y, handle) {
  return (handle === 'left' || handle === 'right') ? x : y;
}

function ResizeWrapper (props) {
  const resizeBarMachine = createResizeWrapperMachine({
    id: 'width',
    initialSize: props.value,
    minimumSize: props.minimum
  });
  const [state, send] = useMachine(resizeBarMachine);
  const controlBarRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  let handle;

  const handleMouseMove = _.throttle(function (event) {
    const position = getPosition(event.clientX, event.clientY, handle);
    send('SLIDE', {
      position,
      precise: event.shiftKey
    });
  }, 1000 / 120);

  function handleMouseUp (event) {
    const position = getPosition(event.clientX, event.clientY, handle);
    setIsActive(false);
    send('END', {
      position,
      precise: event.shiftKey
    });

    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseDown (event) {
    handle = event.target.dataset.handle;
    const position = getPosition(event.clientX, event.clientY, handle);
    setIsActive(true);
    send('START', {
      initialSize: props.value,
      position,
      handle,
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
      className={cx(css.resizeWrapper, {
        [css.resizeWrapperIsActive]: isActive
      })}
      ref={controlBarRef}>
      {props.children}
      <button
        className={css.top}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="top"
        disabled={props.disabled} />
      <button
        className={css.right}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="right"
        disabled={props.disabled} />
      <button
        className={css.bottom}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="bottom"
        disabled={props.disabled} />
      <button
        className={css.left}
        type="button"
        onMouseDown={handleMouseDown}
        data-handle="left"
        disabled={props.disabled} />
    </div>
  );
}

ResizeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  minimum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ResizeWrapper.defaultProps = {
  disabled: false,
  minimum: 75
};

export default ResizeWrapper;
