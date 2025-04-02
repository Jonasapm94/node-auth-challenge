import { preValidationAsyncHookHandler, RouteGenericInterface } from 'fastify';
import { Handler } from '../_lib/http/handler.js';

const preValidation: preValidationAsyncHookHandler = async (request, reply) => {
  if (request.isUnauthenticated()) {
    return reply.redirect('/login');
  }
};

const authenticatedHandler = <ReqOptions extends RouteGenericInterface>(handler: Handler<ReqOptions>) => ({
  preValidation,
  handler,
});

export { authenticatedHandler };
