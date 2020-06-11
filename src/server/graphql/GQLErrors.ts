// eslint-disable-next-line import/prefer-default-export
import { ApolloError } from 'apollo-server-koa';

export const Errors = {
  QL0000: 'UNIMPLEMENTED',
  QL0001: 'USER NOT FOUND',
  QL0002: 'INTERNAL SERVER ERROR',
  QL0003: 'SENSOR NOT FOUND',
  QL0004: 'REMOTE_CONTROLLER NOT FOUND',
  QL0005: 'ACCOUNT CREATION FAILED',
  QL0006: 'LOGIN FAILED',
  QL0007: 'NO REGISTERED IR SERVER',
  QL0008: 'BUTTON NOT FOUND',
  QL0009: 'ALREADY HAVE NAME',
  QL0010: 'FAILED IR SERVER COMMUNICATION',
  QL0011: 'ATTRIBUTES PROVIDER IS NOT VALID',
  QL0012: 'STATES PROVIDER IS NOT VALID',
  QL0013: 'COMMANDS PROVIDER IS NOT VALID',
  QL0014: 'NO MATCH IN COMMANDS SET',
  QL0015: 'DEVICE NOT FOUND',
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
