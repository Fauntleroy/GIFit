import { Machine, assign } from 'xstate';

import GifService from '../services/gif-service';

const gifGenerationSystemMachine = new Machine({
  id: 'ggs',
  initial: 'initializing',
  context: {
    videoElement: null,
    videoAspectRatio: (4 / 3),
    gifData: null,
    gifService: new GifService(),
    width: 420,
    height: 315,
    quality: 5,
    fps: 10,
    start: 0,
    end: 1
  },

  states: {
    // initialization animation
    initializing: {
      on: {
        INITIALIZE_COMPLETE: {
          target: 'configuring',
          actions: ['setInitialDimensions']
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
              actions: ['updateInput']
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
            FRAMES_PROGRESS: '',
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
        RESET: {
          target: 'configuring',
          actions: ['resetData']
        }
      }
    }
  }
}, {
  actions: {
    setInitialDimensions: assign((context, event) => {
      const videoRect = event.videoElement.getBoundingClientRect();
      const videoAspectRatio = videoRect.width / videoRect.height;
      const aspectCorrectHeight = parseInt(context.width / videoAspectRatio, 10);

      return {
        height: aspectCorrectHeight,
        videoAspectRatio,
        videoElement: event.videoElement
      };
    }),
    updateInput: assign((context, event) => {
      return {
        [event.key]: event.value
      };
    }),
    setGifData: assign((context, event) => {
      return {
        gifData: event.data
      };
    }),
    resetData: assign((context, event) => {
      return {
        gifData: null
      };
    })
  },

  services: {
    collateFrames: (context, event) => (callback, onReceive) => {
      // This will send the 'INC' event to the parent every second
      const { gifService, videoElement, width, height, quality, fps, start, end } = context;

      function handleProgress () {
        callback('FRAMES_PROGRESS');
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
