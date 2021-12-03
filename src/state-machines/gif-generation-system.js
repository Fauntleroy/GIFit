import _ from 'lodash';
import { Machine, assign } from 'xstate';

import GifService from '../services/gif-service';

const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 280;

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
        INITIALIZE: [{
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
  }
}, {
  actions: {
    setInitialContext: assign((context, event) => {
      const { videoElement } = event;
      const currentTime = videoElement.currentTime || 0;

      const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      const aspectCorrectHeight = _.round(DEFAULT_WIDTH / videoAspectRatio);

      let width = DEFAULT_WIDTH;
      let height = aspectCorrectHeight;
      if (aspectCorrectHeight > DEFAULT_HEIGHT) {
        width = _.round(DEFAULT_HEIGHT * videoAspectRatio);
        height = DEFAULT_HEIGHT;
      }

      return {
        width,
        height,
        start: (currentTime >= (videoElement.duration - 1))
          ? videoElement.duration - 1
          : currentTime,
        end: Math.min(currentTime + 1.5, videoElement.duration),
        videoAspectRatio,
        videoElement,
        originalTime: currentTime
      };
    }),
    updateInput: assign((context, event) => {
      const { value } = event;
      const frameTime = (1 / context.fps);

      switch (event.key) {
        case 'width':
        case 'height':
          return {
            [event.key]: _.round(event.value)
          };

        case 'start': {
          const start =
            _.round(_.clamp(
              event.value, 0, context.videoElement.duration - frameTime
            ), 2);
          if (start >= (context.end - frameTime)) {
            return {
              start,
              end: _.round(start + frameTime, 2)
            };
          }
          return {
            start
          };
        }

        case 'end': {
          const end =
            _.round(_.clamp(
              event.value, 0 + frameTime, context.videoElement.duration
            ), 2);
          if (end <= (context.start + frameTime)) {
            return {
              start: _.round(end - frameTime, 2),
              end
            };
          }
          return {
            end
          };
        }

        default:
          return {
            [event.key]: value
          };
      }
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
      switch (event.key) {
        case 'start':
          if (
            (event.value < 0)
          ) {
            return false;
          }
          break;
        case 'end':
          if (event.value > context.videoElement.duration) {
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
