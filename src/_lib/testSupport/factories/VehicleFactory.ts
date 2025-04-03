import { Factory } from "fishery";
import type { ModelObject } from "objection";
import { VehicleModel } from "../../../database/models/VehicleModel.js";
import { faker } from "@faker-js/faker";
import { DealershipFactory } from "./DealershipFactory.js";

export const VehicleFactory = Factory.define<ModelObject<VehicleModel>, {}, VehicleModel>(
    ({ onCreate, sequence, params }) => {
        onCreate(async (vehicle) => {
            if (!params.dealershipId) {
                const dealership = await DealershipFactory.create();
                vehicle.dealershipId = dealership.id;
            }

            return await VehicleModel.query()
                .insertAndFetch(vehicle)
                .withGraphFetched('dealership');
        })

        const {
            brand = faker.vehicle.manufacturer(),
            name = faker.vehicle.vehicle(),
            model = faker.vehicle.model(),
            year = faker.date.past().getFullYear().toString(),
            comments = faker.lorem.words(),
            dealership = DealershipFactory.build() as any
        } = params;

        return {
            id: sequence,
            brand,
            name,
            model,
            year,
            comments,
            dealershipId: dealership.id,
            dealership,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
)