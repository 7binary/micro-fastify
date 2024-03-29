import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

interface ErrorObject {
  statusCode: number;
  error: string;
  message: string;
  validation?: Record<string, string>;
  stack?: string;
}

interface PluginOptions {
  withLog: boolean;
  withStack: boolean;
}

export const errorHandlerPlugin = fp((fastify: FastifyInstance, opts: PluginOptions, done) => {

  if (opts.withLog) {
    fastify.addHook('preHandler', (req, reply, next) => {
      if (req.body) {
        fastify.log.info(req.body, '[REQUEST BODY]');
      }
      next();
    });
  }

  fastify.setErrorHandler((err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
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
      errorObject.validation = validation.reduce((acc, validation) => {
        if (validation.instancePath) {
          const key = validation.instancePath?.replace('/', '');
          acc[key] = validation.message || '';
        }
        return acc;
      }, {} as Record<string, string>);
    }

    if (opts.withStack && stack) {
      errorObject.stack = stack;
    }
    if (opts.withLog) {
      fastify.log.warn(errorObject, '[RESPONSE ERROR]');
    }

    return reply.status(statusCode).send(errorObject);
  });

  done();
});

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
