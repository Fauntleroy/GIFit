import _ from 'lodash';
import { Machine, assign } from 'xstate';

function createResizeBarMachine ({ id }) {
  const resizeBarMachine = Machine({
    id: `resize-bar__${id}`,
    initial: 'idle',
    context: {
      initialSize: 100,
      scale: 1,
      precise: false,
      scaleStart: null,
      slideStart: null
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
          slideStart: event.position,
          scaleStart: context.scale
        };
      }),
      resetSlide: assign((context, event) => {
        return {
          activeHandle: null,
          slideStart: null,
          scaleStart: null
        };
      }),
      updateScale: assign((context, event) => {
        const slideStart = (event.precise !== context.precise)
          ? event.position
          : context.slideStart || event.position;
        const scaleStart = (event.precise !== context.precise)
          ? context.scale
          : context.scaleStart || context.scale;
        const delta = context.precise
          ? ((slideStart - event.position) * -1) / 4
          : (slideStart - event.position) * -1;
        const newScale = (context.activeHandle === 'start')
          ? scaleStart + (delta * -1 * 2)
          : scaleStart + (delta * 2);

        return {
          scaleStart: scaleStart,
          slideStart: slideStart,
          precise: event.precise,
          scale: newScale
        };
      }),
      setValue: assign((context, event) => {
        return {
          initialSize: event.initialSize,
          scale: event.scale,
          scaleStart: event.scale
        };
      })
    }
  });

  return resizeBarMachine;
}

export default createResizeBarMachine;
