import { Factory } from "fishery";
import type { ModelObject } from "objection";
import { UserModel, UserRoles } from "../../../database/models/UserModel.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { DealershipFactory } from "./DealershipFactory.js";

export const UserFactory = Factory.define<ModelObject<UserModel>, {}, UserModel>(
    ({ onCreate, sequence, params }) => {
        onCreate(async (user) => {
            delete user.password;
            return await UserModel.query().insertAndFetch(user);
        })

        const {
            name = faker.person.fullName(),
            email = faker.internet.email(),
            password = faker.internet.password(),
            role = faker.helpers.enumValue(UserRoles),
            dealership = DealershipFactory.build() as any,
        } = params;

        return {
            id: sequence,
            name,
            email,
            password,
            encryptedPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            role,
            dealership,
            dealershipId: dealership?.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
)