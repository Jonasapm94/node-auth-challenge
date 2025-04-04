import { handler } from '../../_lib/http/handler.js';

const index = handler(async (request, reply) => {
  return reply.redirect('/vehicles');
});

export { index };
