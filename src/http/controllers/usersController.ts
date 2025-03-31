import bcrypt from 'bcryptjs';
import { handler } from '../../_lib/http/handler.js';
import { UserModel, UserRoles } from '../../database/models/UserModel.js';
import { DealershipModel } from '../../database/models/DealershipModel.js';

const index = handler(async (request, reply) => {
  const users = await UserModel.query();

  return reply.view('users/index', { users });
});

const create = handler(async (request, reply) => {
  const dealerships = await DealershipModel.query();
  return reply.view('users/create', { user: new UserModel(), dealerships });
});

const store = handler<{
  Body: { name: string; email: string; password: string; role: UserRoles; dealershipId: number };
}>(async (request, reply) => {
  const { name, email, password, role, dealershipId } = request.body;

  try {
    if (role === UserRoles.dealership && !dealershipId) throw new Error('Dealership user must have a dealership ID');

    const encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
    await UserModel.query().insert({ name, email, encryptedPassword, role, dealershipId });

    return reply.redirect(`/users`);
  } catch (error) {
    console.error(error);
    return reply.view('users/create', { user: new UserModel().$set({ name, email, password, role }) });
  }
});

const edit = handler<{ Params: { id: string } }>(async (request, reply) => {
  const user = await UserModel.query().findById(request.params.id).throwIfNotFound();
  const dealerships = await DealershipModel.query();

  return reply.view('users/update', { user, dealerships });
});

const update = handler<{
  Params: { id: string };
  Body: { name: string; email: string; password: string; role: UserRoles };
}>(async (request, reply) => {
  const user = await UserModel.query().findById(request.params.id).throwIfNotFound();
  const { name, email, password, role } = request.body;
  const newUser = user.$set({ name, email, password, role });

  try {
    await newUser.$query().update();

    return reply.redirect(`/users`);
  } catch (error) {
    console.error(error);
    return reply.view('users/update', { user: newUser });
  }
});

export { index, create, store, edit, update };
