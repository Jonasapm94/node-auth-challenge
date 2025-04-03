import { Factory } from "fishery";
import type { ModelObject } from "objection";
import { DealershipModel } from "../../../database/models/DealershipModel.js";
import { faker } from "@faker-js/faker";
import { UserModel } from "../../../database/models/UserModel.js";

export const DealershipFactory = Factory.define<ModelObject<DealershipModel>, {}, DealershipModel>(
    ({ onCreate, sequence, params }) => {
        onCreate(async (dealership) => {
            return await DealershipModel.query().insertAndFetch(dealership);
        })

        const {
            name = faker.company.name(),
            users = [] as UserModel[]
        } = params;

        return {
            id: sequence,
            name,
            users,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
)