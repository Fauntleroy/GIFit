import _ from 'lodash';
import { Machine, assign } from 'xstate';

function createResizeWrapperMachine ({ id, initialSize, minimumSize }) {
  const resizeWrapperMachine = Machine({
    id: `resize-bar__${id}`,
    initial: 'idle',
    context: {
      activeHandle: null,
      initialSize: initialSize,
      initialPosition: null,
      currentPosition: null,
      scale: 1,
      size: initialSize,
      precise: false
    },
    states: {
      idle: {
        on: {
          START: {
            actions: ['initializeSlide', 'updateScale'],
            target: 'active'
          },
          VALUE: {
            actions: ['setValue']
          }
        }
      },
      active: {
        on: {
          SLIDE: {
            actions: ['updateScale']
          },
          END: {
            actions: ['updateScale', 'resetSlide'],
            target: 'idle'
          }
        }
      },
      disabled: {
        on: {
          ENABLE: {
            target: 'idle'
          }
        }
      }
    },
    on: {
      DISABLE: '.disabled'
    }
  }, {
    actions: {
      initializeSlide: assign((context, event) => {
        return {
          activeHandle: event.handle,
          currentPosition: event.position,
          initialPosition: event.position,
          initialSize: event.initialSize,
          initialScale: context.scale,
          precise: false
        };
      }),
      resetSlide: assign(() => {
        return {
          activeHandle: null,
          currentPosition: null,
          initialPosition: null,
          initialSize: null,
          initialScale: null,
          scale: 1,
          precise: false
        };
      }),
      updateScale: assign((context, event) => {
        const delta = (event.position - context.initialPosition) * 2;
        const deltaRatio = delta / context.initialSize;
        let scale = (context.activeHandle === 'left' || context.activeHandle === 'top')
          ? context.initialScale - deltaRatio
          : context.initialScale + deltaRatio;
        const minimumScale = minimumSize / context.initialSize;
        scale = _.clamp(scale, minimumScale, Infinity);
        let size = _.clamp(
          Math.round(scale * context.initialSize),
          minimumSize,
          Infinity
        );

        if (event.precise) {
          size = Math.round(size - (size % 5));
          scale = size / context.initialSize;
        }

        return {
          precise: event.precise,
          scale,
          size
        };
      }),
      setValue: assign((event) => {
        return {
          initialSize: event.initialSize,
          scale: event.scale
        };
      })
    }
  });

  return resizeWrapperMachine;
}

export default createResizeWrapperMachine;
