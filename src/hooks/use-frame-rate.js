import _ from 'lodash';
import { useEffect, useState, useRef } from 'react';

const NO_OP = () => {};

function useFrameRate (config) {
  const { fps = 60, onFrame = NO_OP } = config;
  const fpsRef = useRef(fps);
  const [currentFrame, setCurrentFrame] = useState(0);
  const firstTimestamp = performance.now();
  const [currentTime, setCurrentTime] = useState(firstTimestamp);
  let lastFrame = null;
  let rafId;

  function rafLoopFn (timestamp) {
    const timeSinceInit = timestamp - firstTimestamp;
    const timeBetweenFrames = 1000 / fpsRef.current;
    const _currentFrame = Math.floor(timeSinceInit / timeBetweenFrames);
    setCurrentFrame(_currentFrame);
    setCurrentTime(timestamp);

    if ((_currentFrame > lastFrame) || _.isNull(lastFrame)) {
      onFrame(_currentFrame, timeSinceInit);
      lastFrame = _currentFrame;
    }

    rafId = window.requestAnimationFrame(rafLoopFn);
  }

  useEffect(() => {
    if (!_.isNumber(fps)) {
      return;
    }

    fpsRef.current = fps;
    rafId = window.requestAnimationFrame(rafLoopFn);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [fps]);

  return [currentFrame, currentTime - firstTimestamp];
}

export default useFrameRate;
