import _ from 'lodash';
import { useEffect } from 'react';

function useFrameRate (fn, config) {
  const { fps = 60 } = config;
  const firstTimestamp = performance.now();
  const timeBetweenFrames = 1000 / fps;
  let lastFrame = null;

  function rafLoopFn (timestamp) {
    const timeSinceInit = timestamp - firstTimestamp;
    const currentFrame = Math.floor(timeSinceInit / timeBetweenFrames);

    if ((currentFrame > lastFrame) || _.isNull(lastFrame)) {
      fn(currentFrame, timeSinceInit);
      lastFrame = currentFrame;
    }

    requestAnimationFrame(rafLoopFn);
  }

  useEffect(() => {
    requestAnimationFrame(rafLoopFn);
  }, []);
}

export default useFrameRate;
