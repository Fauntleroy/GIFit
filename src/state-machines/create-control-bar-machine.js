import _ from 'lodash';
import { Machine, assign } from 'xstate';

function createControlBarMachine ({ id, start, end }) {
  const controlBarMachine = Machine({
    id: `control-bar__${id}`,
    initial: 'idle',
    context: {
      start,
      end,
      precise: false,
      slideStart: null
    },
    states: {
      idle: {
        on: {
          START: {
            actions: ['setActiveHandle', 'updatePosition'],
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
            actions: ['updatePosition']
          },
          END: {
            actions: ['updatePosition', 'resetSlideStart'],
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
      updatePosition: assign((context, event) => {
        const startPosition = (event.precise !== context.precise)
          ? event.position
          : context.slideStart || event.position;
        const delta = context.precise
          ? ((startPosition - event.position) * -1) / 4
          : (startPosition - event.position) * -1;
        const position = startPosition + delta;
        // don't fly past the other handle, or out of bounds
        const minPosition = (context.activeHandle === 'start')
          ? 0
          : context.start;
        const maxPosition = (context.activeHandle === 'start')
          ? context.end
          : 1;
        const newPosition = _.clamp(position, minPosition, maxPosition);

        return {
          [context.activeHandle]: newPosition,
          slideStart: startPosition,
          precise: event.precise
        };
      }),
      resetSlideStart: assign((context, event) => {
        return {
          slideStart: null,
          activeHandle: null
        };
      }),
      setActiveHandle: assign((context, event) => {
        const distanceFromStart = Math.abs(event.position - context.start);
        const distanceFromEnd = Math.abs(event.position - context.end);
        const activeHandle = (distanceFromStart < distanceFromEnd)
          ? 'start'
          : 'end';

        return {
          activeHandle
        };
      }),
      setValue: assign((context, event) => {
        return {
          start: event.start,
          end: event.end
        };
      })
    }
  });

  return controlBarMachine;
}

export default createControlBarMachine;
