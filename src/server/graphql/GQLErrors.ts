// eslint-disable-next-line import/prefer-default-export
import { ApolloError } from 'apollo-server-koa';

export const Errors = {
  QL0001: 'USER NOT FOUND',
} as const;

export const createError = (
  code: keyof typeof Errors,
  message?: string,
  properties?: Record<string, any>,
) => new ApolloError(
  message,
  code,
  {
    ...properties,
    message: Errors[code],
  },
);
