import { setup, ActorRefFrom } from 'xstate';

type Input = {
  message: string;
};
type Context = {
  message: string;
};
export const childMachine = setup({
  types: { input: {} as Input, context: {} as Context },
}).createMachine({
  id: 'child',
  entry: () => {
    console.log('loaded');
  },
  context: ({ input: { message } }) => {
    return { message };
  },

  initial: 'idle',
  states: {
    idle: {},
  },
});

export type ChildActorRef = ActorRefFrom<typeof childMachine>;
