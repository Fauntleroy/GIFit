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
            actions: ['updatePosition'],
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
        const newPosition = _.clamp(position, 0, 1);

        const startDistance = Math.abs(newPosition - context.start);
        const endDistance = Math.abs(newPosition - context.end);
        const handleKey = startDistance < endDistance
          ? 'start'
          : 'end';

        return {
          [handleKey]: newPosition,
          slideStart: startPosition,
          precise: event.precise
        };
      }),
      resetSlideStart: assign((context, event) => {
        return {
          slideStart: null
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
