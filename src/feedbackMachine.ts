import { assign, setup } from 'xstate';
import { childMachine, ChildActorRef } from './childMachine';

export const feedbackMachine = setup({
  types: {
    context: {} as { feedback: string; child: ChildActorRef | null },
    events: {} as
      | {
          type: 'feedback.good';
        }
      | {
          type: 'feedback.bad';
        }
      | {
          type: 'feedback.update';
          value: string;
        }
      | { type: 'submit' }
      | {
          type: 'close';
        }
      | { type: 'back' }
      | { type: 'restart' },
  },
  actors: {
    childActor: childMachine,
  },
  actions: {
    spawnChild: assign({
      child: ({ spawn }) => {
        return spawn('childActor', { input: { message: 'message' } });
      },
    }),
  },
  guards: {
    feedbackValid: ({ context }) => context.feedback.length > 0,
  },
}).createMachine({
  id: 'feedback',
  initial: 'prompt',
  context: {
    feedback: '',
    child: null,
  },
  states: {
    prompt: {
      on: {
        'feedback.good': {
          target: 'thanks',
          actions: ['spawnChild'],
        },
        'feedback.bad': 'form',
      },
    },
    form: {
      on: {
        'feedback.update': {
          actions: assign({
            feedback: ({ event }) => event.value,
          }),
        },
        back: { target: 'prompt' },
        submit: {
          guard: 'feedbackValid',
          target: 'thanks',
        },
      },
    },
    thanks: {},
    closed: {
      on: {
        restart: {
          target: 'prompt',
          actions: assign({
            feedback: '',
          }),
        },
      },
    },
  },
  on: {
    close: '.closed',
  },
});
