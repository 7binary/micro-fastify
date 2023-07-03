import { FastifyInstance, FastifyReply, FastifyRequest, ValidationResult } from 'fastify';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import fp from 'fastify-plugin';

interface ErrorObject {
  statusCode: number;
  error: string;
  message: string;
  validation?: Record<string, string>;
  stack?: string;
}

export const errorHandlerPlugin: FastifyPluginAsyncTypebox<{
  withStack?: boolean;
  withLog?: boolean;
}> = fp(async (fastify: FastifyInstance, opts) => {

  fastify.setErrorHandler((err: any, request: FastifyRequest, reply: FastifyReply) => {
    const { message, validation, code, stack } = err;
    const hasValidationErrors = Array.isArray(validation);
    const statusCode = err.statusCode || 500;
    const error: string = hasValidationErrors || code === 'VALIDATION_ERROR'
      ? 'Validation Error'
      : statuses[statusCode];

    const errorObject: ErrorObject = {
      statusCode,
      error,
      message: statusCode >= 500 ? error : message.replace(/body\/[^ ]* /gi, ''),
    };

    if (hasValidationErrors) {
      errorObject.validation = validation.reduce((acc: any, validation: ValidationResult) => {
        if (validation.instancePath) {
          const key = validation.instancePath?.replace('/', '');
          acc[key] = validation.message;
        }
        return acc;
      }, {});
    }

    if (opts.withStack && stack) {
      errorObject.stack = stack;
    }

    opts.withLog && fastify.log.error(stack || errorObject);

    return reply.status(statusCode).send(errorObject);
  });
}, { name: 'error-handler', fastify: '4.x' });

const statuses: Record<string, string> = {
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '306': 'Unused',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Required',
  '413': 'Request Entry Too Large',
  '414': 'Request-URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',
  '429': 'Too Many Requests',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
};
