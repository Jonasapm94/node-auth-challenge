import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { makeServer } from "../../src/http/server.js";
import { UserFactory } from "../../src/_lib/testSupport/factories/UserFactory.js";
import { faker } from "@faker-js/faker";
import { IntegrationTest, setupIntegrationTest } from "../../src/_lib/testSupport/setupIntegrationTest.js";
import { VehicleModel } from "../../src/database/models/VehicleModel.js";
import { DealershipFactory } from "../../src/_lib/testSupport/factories/DealershipFactory.js";
import { UserRoles } from "../../src/database/models/UserModel.js";

describe("POST /vehicles", () => {
    let server: FastifyInstance;
    let integrationTest: IntegrationTest;

    beforeAll(async () => {
        server = await makeServer();
        integrationTest = await setupIntegrationTest();
    })

    beforeEach(async () => {
        await integrationTest.cleanDatabase();
    })

    afterAll(async () => {
        await integrationTest.tearDown();
    })

    describe("when the input is valid", () => {
        it("the vehicle created will have the user's dealership Id", async () => {
            const dealership = await DealershipFactory.create();
            const password = faker.internet.password();
            const user = await UserFactory.create({ role: UserRoles.dealership, dealership, dealershipId: dealership.id, password });

            const loginRequest = await server.inject({
                method: "POST",
                url: "/login",
                body: {
                    email: user.email,
                    password
                },
                headers: {
                    "Content-Type": "application/json"
                }

            })

            const cookies = loginRequest.cookies;
            const input = {
                name: faker.vehicle.vehicle(),
                brand: faker.vehicle.manufacturer(),
                model: faker.vehicle.model(),
                year: faker.date.past().getFullYear().toString(),
                comments: faker.lorem.words(),
            }

            const numOfVehiclesBeforeInput = await VehicleModel.query().resultSize();
            expect(numOfVehiclesBeforeInput).toBe(0);

            const response = await server.inject({
                method: 'POST',
                url: '/vehicles',
                body: input,
                cookies: {
                    [cookies[0].name]: cookies[0].value.toString()
                }
            })

            const vehicle = await VehicleModel.query().findOne('dealershipId', user.dealershipId);

            expect(vehicle).toBeTruthy()
        })
    })

    describe("when the user who made the request is not logged in", () => {
        it("redirects the request to login page", async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/vehicles'
            })

            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toBe("/login")
        })
    })
})