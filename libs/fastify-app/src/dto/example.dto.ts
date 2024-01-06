import { Static, Type } from '@sinclair/typebox';

export const ExampleDto = Type.Object({
  email: Type.String({
    format: 'email',
    errorMessage: { format: 'Must be a valid Email address' },
  }),
  password: Type.String({
    minLength: 6,
    maxLength: 20,
    errorMessage: {
      minLength: 'Password must be between 6 and 20 characters',
      maxLength: 'Password must be between 6 and 20 characters',
    },
  }),
});

export type ExampleDtoType = Static<typeof ExampleDto>;
