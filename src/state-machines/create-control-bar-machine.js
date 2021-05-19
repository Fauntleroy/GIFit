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
        const minimum = context.activeHandle === 'start' ? 0 : event.minimumDistance;
        const maximum = context.activeHandle === 'end' ? 1 : 1 - event.minimumDistance;
        const newPosition = _.clamp(position, minimum, maximum);

        const contextUpdates = {
          [context.activeHandle]: newPosition,
          slideStart: startPosition,
          precise: event.precise
        };

        if (
          (context.activeHandle === 'start') &&
          (newPosition > context.end - event.minimumDistance)
        ) {
          contextUpdates.end = newPosition + event.minimumDistance;
        }

        if (
          (context.activeHandle === 'end') &&
          (newPosition < context.start + event.minimumDistance)
        ) {
          contextUpdates.start = newPosition - event.minimumDistance;
        }

        return contextUpdates;
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
