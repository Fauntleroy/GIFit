import _ from 'lodash';
import { useEffect, useState } from 'react';

const NO_OP = () => {};

function useFrameRate (config) {
  const { fps = 60, onFrame = NO_OP } = config;
  const [currentFrame, setCurrentFrame] = useState(0);
  const firstTimestamp = performance.now();
  const [currentTime, setCurrentTime] = useState(firstTimestamp);
  const timeBetweenFrames = 1000 / fps;
  let lastFrame = null;
  let rafId;

  function rafLoopFn (timestamp) {
    const timeSinceInit = timestamp - firstTimestamp;
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
    rafId = window.requestAnimationFrame(rafLoopFn);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return [currentFrame, currentTime - firstTimestamp];
}

export default useFrameRate;
