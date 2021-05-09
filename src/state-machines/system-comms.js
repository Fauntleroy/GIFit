import { Machine, assign } from 'xstate';

const systemCommsMachine = new Machine({
  id: 'system-comms',
  initial: 'active',
  context: {
    message: null
  },
  states: {
    active: {
      on: {
        MESSAGE: {
          actions: ['updateMessage']
        },
        DEACTIVATE: 'inactive'
      }
    },
    inactive: {
      on: {
        ACTIVATE: 'active'
      }
    }
  }
}, {
  actions: {
    updateMessage: assign((context, event) => {
      return {
        message: event.text
      };
    })
  }
});

export default systemCommsMachine;
