import { Machine, assign } from 'xstate';

import findClosestElement from '$utils/find-closest-element';
import { NoVideoFoundError, VideoNotValidError, VideoOriginMismatchError, VideoSrcInvalidError } from '$utils/errors';

function isVideoValid (videoElement) {
  const duration = Math.max(0, videoElement.duration) || 0;

  return (duration > 0);
}

function getCurrentVideo () {
  return new Promise((resolve, reject) => {
    const videoElements = document.querySelectorAll('video') || [];
    const closestVideo = findClosestElement(videoElements);

    if (!closestVideo) {
      return reject(new NoVideoFoundError());
    }

    if (!isVideoValid(closestVideo)) {
      return reject(new VideoNotValidError());
    }

    // can throw
    let videoSrcUrl;
    try {
      videoSrcUrl = new URL(closestVideo.currentSrc);
    } catch (error) {
      return reject(new VideoSrcInvalidError());
    }
    if (window.location.origin !== videoSrcUrl.origin) {
      return reject(new VideoOriginMismatchError(closestVideo.currentSrc));
    }

    return resolve(closestVideo);
  });
}

const gifitAppMachine = new Machine({
  id: 'gifit-app',
  initial: 'closed',
  context: {
    message: null,
    criticalError: null,
    currentVideo: null
  },
  states: {
    closed: {
      on: {
        INITIALIZE: 'initializing'
      }
    },
    initializing: {
      invoke: {
        src: getCurrentVideo,
        onDone: {
          target: 'initialized',
          actions: ['assignCurrentVideo']
        },
        onError: {
          target: 'criticalError',
          actions: ['assignCriticalError']
        }
      }
    },
    criticalError: {},
    initialized: {}
  },
  on: {
    CLOSE: {
      target: 'closed',
      actions: ['resetContext']
    }
  }
}, {
  actions: {
    assignCurrentVideo: assign((context, event) => {
      return {
        currentVideo: event.data
      };
    }),
    assignCriticalError: assign((context, event) => {
      return {
        criticalError: event.data
      };
    })
  }
});

export default gifitAppMachine;
