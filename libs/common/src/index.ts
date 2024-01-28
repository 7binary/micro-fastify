import { NotAuthorizedError } from './errors/not-authorized.error';
import { NotFoundError } from './errors/not-found.error';
import { ValidationError } from './errors/validation.error';
import { errorHandlerPlugin } from './plugins/error-handler.plugin';
import { authPlugin, JwtPayload } from './plugins/auth.plugin';
import { kafkaPlugin } from './plugins/kafka.plugin';

export {
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
  errorHandlerPlugin,
  authPlugin,
  JwtPayload,
  kafkaPlugin,
};
