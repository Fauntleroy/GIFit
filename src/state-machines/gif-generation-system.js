import _ from 'lodash';
import { Machine, assign } from 'xstate';

import GifService from '../services/gif-service';

const DEFAULT_WIDTH = 420;

const gifGenerationSystemMachine = new Machine({
  id: 'ggs',
  initial: 'initializing',
  context: {
    videoElement: null,
    videoAspectRatio: null,
    gifData: null,
    gifService: new GifService(),
    width: 0,
    height: 0,
    quality: 5,
    fps: 10,
    start: 0,
    end: 1.5,
    originalTime: 0,
    framesComplete: 0
  },

  states: {
    // initialization animation
    initializing: {
      on: {
        INITIALIZE_COMPLETE: [{
          target: 'configuring',
          actions: ['setInitialContext']
        }]
      }
    },
    criticalError: {
      on: {
        RESET: {
          target: 'configuring',
          actions: ['resetData', 'resetFramesProgress', 'resetErrors']
        }
      }
    },
    // form ready for input
    configuring: {
      initial: 'inputting',
      states: {
        inputting: {
          on: {
            INPUT: {
              actions: ['updateInput'],
              cond: 'inputValidation'
            },
            SUBMIT: 'validating'
          }
        },
        validating: {
          on: {
            VALIDATION_ERROR: 'invalidated',
            VALIDATION_SUCCESS: 'validated'
          }
        },
        invalidated: {
          on: { SUBMIT: 'validating' }
        },
        validated: {
          type: 'final'
        }
      },
      onDone: {
        target: 'generating'
      }
    },
    // generate the GIF (2 step process)
    generating: {
      initial: 'collatingFrames',
      states: {
        collatingFrames: {
          initial: 'collating',
          context: {
            collated: 0,
            total: 0
          },
          states: {
            collating: {
              invoke: {
                src: 'collateFrames'
              }
            },
            succeeded: {
              type: 'final'
            },
            failed: {}
          },
          on: {
            FRAMES_PROGRESS: {
              actions: ['setFramesProgress']
            },
            FRAMES_ERROR: 'collatingFrames.failed',
            FRAMES_SUCCESS: 'collatingFrames.succeeded'
          },
          onDone: {
            target: 'generatingGif'
          }
        },
        generatingGif: {
          initial: 'generating',
          context: {
            progress: 0
          },
          states: {
            generating: {
              invoke: {
                src: 'generateGif'
              }
            },
            succeeded: {
            },
            failed: {}
          },
          on: {
            GENERATION_PROGRESS: '',
            GENERATION_ERROR: 'generatingGif.failed',
            GENERATION_SUCCESS: {
              target: 'generatingGif.succeeded',
              actions: ['setGifData']
            }
          }
        }
      },
      on: {
        ABORT: {
          target: 'configuring',
          actions: ['abortGeneration', 'resetData', 'resetFramesProgress', 'resetErrors']
        },
        RESET: {
          target: 'configuring',
          actions: ['resetData', 'resetFramesProgress', 'resetErros']
        }
      }
    }
  },
  on: {
    CRITICAL_ERROR: {
      target: 'criticalError',
      actions: ['setCriticalError']
    }
  }
}, {
  actions: {
    setInitialContext: assign((context, event) => {
      const { videoElement } = event;
      const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      const aspectCorrectHeight = _.round(DEFAULT_WIDTH / videoAspectRatio);
      const currentTime = videoElement.currentTime || 0;

      return {
        width: DEFAULT_WIDTH,
        height: aspectCorrectHeight,
        start: (currentTime >= (videoElement.duration - 1))
          ? videoElement.duration - 1
          : currentTime,
        end: Math.min(currentTime + 1.5, videoElement.duration),
        videoAspectRatio,
        videoElement,
        originalTime: currentTime
      };
    }),
    setCriticalError: assign((context, event) => {
      return {
        criticalError: {
          title: event.title,
          message: event.message
        }
      };
    }),
    updateInput: assign((context, event) => {
      let value = event.value;

      if (event.key === 'width' || event.key === 'height') {
        value = _.round(event.value);
      }

      if (event.key === 'start' || event.key === 'end') {
        value = _.round(event.value, 2);
      }

      return {
        [event.key]: value
      };
    }),
    setGifData: assign((context, event) => {
      return {
        gifData: event.data
      };
    }),
    resetData: assign(() => {
      return {
        gifData: null
      };
    }),
    abortGeneration: assign((context) => {
      context.gifService.abort();
      return {};
    }),
    setFramesProgress: assign((context, event) => {
      return {
        framesComplete: event.framesComplete
      };
    }),
    resetFramesProgress: assign(() => {
      return {
        framesComplete: 0
      };
    }),
    resetErrors: assign(() => {
      return {
        criticalError: null
      };
    })
  },

  guards: {
    inputValidation (context, event) {
      const frameTime = (1 / context.fps);

      switch (event.key) {
        case 'start':
          if (
            (event.value >= (context.end - frameTime)) ||
            (event.value < 0)
          ) {
            return false;
          }
          break;
        case 'end':
          if (event.value <= (context.start + frameTime)) {
            return false;
          }
          break;
        case 'width':
          if (event.value < 1) {
            return false;
          }
          break;
        case 'height':
          if (event.value < 1) {
            return false;
          }
          break;
        default:
          return true;
      }

      return true;
    }
  },

  services: {
    collateFrames: (context, event) => (callback, onReceive) => {
      // This will send the 'INC' event to the parent every second
      const { gifService, videoElement, width, height, quality, fps, start, end } = context;

      function handleProgress (framesProgress, framesComplete) {
        callback({ type: 'FRAMES_PROGRESS', framesProgress, framesComplete });
      }
      function handleComplete () {
        callback('FRAMES_SUCCESS');
      }

      gifService.createGif({
        width,
        height,
        quality,
        fps,
        start: start * 1000,
        end: end * 1000
      }, videoElement);
      gifService.on('frames progress', handleProgress);
      gifService.on('frames complete', handleComplete);

      // Perform cleanup
      return () => {
        gifService.off('frames progress', handleProgress);
        gifService.off('frames complete', handleComplete);
      };
    },
    generateGif: (context, event) => (callback, onReceive) => {
      // This will send the 'INC' event to the parent every second
      const { gifService } = context;

      function handleProgress () {
        callback('GENERATION_PROGRESS');
      }
      function handleComplete (gifData) {
        callback({ type: 'GENERATION_SUCCESS', data: gifData });
      }

      gifService.on('progress', handleProgress);
      gifService.on('complete', handleComplete);

      // Perform cleanup
      return () => {
        gifService.off('progress', handleProgress);
        gifService.off('complete', handleComplete);
      };
    }
  }
});

export default gifGenerationSystemMachine;
