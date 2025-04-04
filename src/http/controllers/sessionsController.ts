import { handler } from '../../_lib/http/handler.js';
import { UserModel } from '../../database/models/UserModel.js';

const create = handler(async (request, reply) => {
  return reply.view('sessions/login', { user: new UserModel() });
});

const destroy = handler<{ Params: { id: string } }>(async (request, reply) => {
  await request.logout();

  return reply.redirect(`/vehicles`);
});

export { create, destroy };
