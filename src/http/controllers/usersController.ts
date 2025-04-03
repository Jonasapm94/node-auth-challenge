import bcrypt from 'bcryptjs';
import { handler } from '../../_lib/http/handler.js';
import { UserModel, UserRoles } from '../../database/models/UserModel.js';
import { DealershipModel } from '../../database/models/DealershipModel.js';
import { canCreateUserPolicy } from '../../policies/createUserPolicies.js';

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
    const encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
    const user = UserModel.fromJson({ name, email, encryptedPassword, role, dealershipId });

    if (!canCreateUserPolicy(user)) throw new Error('Dealership user must have a dealership ID');

    await user.$query().insert();

    return reply.redirect(`/users`);
  } catch (error) {
    console.error(error);
    return reply.view('users/create', { user: new UserModel().$set({ name, email, password, role }) });
  }
});

const edit = handler<{ Params: { id: string } }>(async (request, reply) => {
  let user!: UserModel;
  let dealerships!: DealershipModel[];
  await Promise.all([
    (async () => {
      user = await UserModel.query().findById(request.params.id).throwIfNotFound();
    })(),
    (async () => {
      dealerships = await DealershipModel.query();
    })(),
  ]);

  return reply.view('users/update', { user, dealerships });
});

const update = handler<{
  Params: { id: string };
  Body: { name: string; email: string; password: string; role: UserRoles };
}>(async (request, reply) => {
  const user = await UserModel.query().findById(request.params.id).throwIfNotFound();

  const { name, email, password, role } = request.body;

  const encryptedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  const newUser = user.$set({ name, email, encryptedPassword, role });

  try {
    await newUser.$query().update();

    return reply.redirect(`/users`);
  } catch (error) {
    console.error(error);

    const dealerships = await DealershipModel.query();
    return reply.view('users/update', { user: newUser, dealerships });
  }
});

export { index, create, store, edit, update };
