import { DealershipModel } from '../../database/models/DealershipModel.js';
import { authenticatedHandler } from '../auth.js';

const index = authenticatedHandler(async (request, reply) => {
  const dealerships = await DealershipModel.query();

  return reply.view('dealerships/index', { dealerships });
});

const create = authenticatedHandler(async (request, reply) => {
  return reply.view('dealerships/create', { dealership: new DealershipModel() });
});

const store = authenticatedHandler<{ Body: { name: string } }>(async (request, reply) => {
  const { name } = request.body;

  try {
    await DealershipModel.query().insert({ name });

    return reply.redirect(`/dealerships`);
  } catch (error) {
    console.error(error);
    return reply.view('dealerships/create', { dealership: new DealershipModel().$set({ name }) });
  }
});

const edit = authenticatedHandler<{ Params: { id: string } }>(async (request, reply) => {
  const dealership = await DealershipModel.query().findById(request.params.id).throwIfNotFound();

  return reply.view('dealerships/update', { dealership });
});

const update = authenticatedHandler<{
  Params: { id: string };
  Body: { name: string };
}>(async (request, reply) => {
  const dealership = await DealershipModel.query().findById(request.params.id).throwIfNotFound();
  const { name } = request.body;
  const newDealership = dealership.$set({ name });

  try {
    await newDealership.$query().update();

    return reply.redirect(`/dealerships`);
  } catch (error) {
    console.error(error);
    return reply.view('dealerships/update', { dealership: newDealership });
  }
});

const destroy = authenticatedHandler<{ Params: { id: string } }>(async (request, reply) => {
  try {
    await DealershipModel.query().findById(request.params.id).throwIfNotFound().delete();

    return reply.redirect(`/dealerships`);
  } catch (error) {
    console.error(error);
    return reply.redirect('/dealerships');
  }
});

export { index, create, store, edit, update, destroy };
