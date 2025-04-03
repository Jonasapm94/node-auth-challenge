import { handler } from '../../_lib/http/handler.js';
import { UserModel } from '../../database/models/UserModel.js';
import { VehicleModel } from '../../database/models/VehicleModel.js';
import { authenticatedHandler } from '../auth.js';

const index = handler(async (request, reply) => {
  const vehicles = await VehicleModel.query();

  return reply.view('vehicles/index', { vehicles });
});

const create = authenticatedHandler(async (request, reply) => {
  return reply.view('vehicles/create', { vehicle: new VehicleModel() });
});

const store = authenticatedHandler<{
  Body: { name: string; brand: string; model: string; year: string; comments: string; dealershipId: number };
}>(async (request, reply) => {
  const { name, brand, model, year, comments } = request.body;

  try {
    const dealershipId = Number((request.user as UserModel).dealershipId);
    if (!dealershipId) throw new Error('Dealership was not found from the request user');

    await VehicleModel.query().insert({ name, brand, model, year, comments, dealershipId });

    return reply.redirect(`/vehicles`);
  } catch (error) {
    console.error(error);
    return reply.view('vehicles/create', {
      vehicle: new VehicleModel().$set({ name, brand, model, year, comments }),
    });
  }
});

const edit = authenticatedHandler<{ Params: { id: string } }>(async (request, reply) => {
  const vehicle = await VehicleModel.query().findById(request.params.id).throwIfNotFound();

  return reply.view('vehicles/update', { vehicle });
});

const update = authenticatedHandler<{
  Params: { id: string };
  Body: { name: string; brand: string; model: string; year: string; comments: string; dealershipId: number };
}>(async (request, reply) => {
  const vehicle = await VehicleModel.query().findById(request.params.id).throwIfNotFound();
  const { name, brand, model, year, comments, dealershipId } = request.body;
  const newVehicle = vehicle.$set({ name, brand, model, year, comments, dealershipId });

  try {
    await newVehicle.$query().update();

    return reply.redirect(`/vehicles`);
  } catch (error) {
    console.error(error);
    return reply.view('vehicles/update', { vehicle: newVehicle });
  }
});

const destroy = authenticatedHandler<{ Params: { id: string } }>(async (request, reply) => {
  try {
    await VehicleModel.query().findById(request.params.id).throwIfNotFound().delete();

    return reply.redirect(`/vehicles`);
  } catch (error) {
    console.error(error);
    return reply.redirect('/vehicles');
  }
});

export { index, create, store, edit, update, destroy };
