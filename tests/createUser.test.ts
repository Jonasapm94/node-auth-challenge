import { beforeEach, beforeAll, describe, afterAll, it, expect } from "vitest";
import { IntegrationTest, setupIntegrationTest } from "../src/_lib/testSupport/setupIntegrationTest.js";
import { FastifyInstance } from "fastify";
import { makeServer } from "../src/http/server.js";
import { faker } from '@faker-js/faker';
import { UserModel, UserRoles } from "../src/database/models/UserModel.js";
import { DealershipFactory } from "../src/_lib/testSupport/factories/DealershipFactory.js";

describe("POST /signup", () => {
    let integrationTest: IntegrationTest
    let server: FastifyInstance;

    beforeAll(async () => {
        integrationTest = await setupIntegrationTest()
        server = await makeServer()
    })

    beforeEach(async () => {
        await integrationTest.cleanDatabase()
    })

    afterAll(async () => {
        await integrationTest.tearDown()
    })

    describe("when the input is valid", () => {
        it("creates a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: UserRoles.admin,
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest + 1);
        })

        describe("when the input role is dealership", () => {
            it("creates a new user", async () => {
                const dealership = await DealershipFactory.create();

                const input = {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    role: UserRoles.dealership,
                    dealershipId: dealership.id
                }

                const numUsersBeforeRequest = await UserModel.query().resultSize()

                await server.inject({
                    method: 'POST',
                    url: '/signup',
                    body: input
                })

                const users = await UserModel.query();

                expect(users.length).toBe(numUsersBeforeRequest + 1);
            })

            describe("when there is no dealership with the given id", () => {
                it("does not create a new user", async () => {
                    const input = {
                        name: faker.person.fullName(),
                        email: faker.internet.email(),
                        password: faker.internet.password(),
                        role: UserRoles.dealership,
                        dealershipId: faker.number.int({ min: 1, max: 10 })
                    }

                    const numUsersBeforeRequest = await UserModel.query().resultSize()

                    await server.inject({
                        method: 'POST',
                        url: '/signup',
                        body: input
                    })

                    const users = await UserModel.query();

                    expect(users.length).toBe(numUsersBeforeRequest);
                })
            })
        })
    })

    describe("when the dealership id is not sent", () => {
        it("does not create a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: UserRoles.dealership,
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })

    describe("when the name is not sent in the input", () => {
        it("does not create a new user", async () => {
            const input = {
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: UserRoles.admin,
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })

    describe("when the email is not sent in the input", () => {
        it("does not create a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                password: faker.internet.password(),
                role: UserRoles.admin,
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })

    describe("when the password is not sent in the input", () => {
        it("does not create a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                role: UserRoles.admin,
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })

    describe("when the role is not sent in the input", () => {
        it("does not create a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })

    describe("when sending an incorrect role in the input", () => {
        it("does not create a new user", async () => {
            const input = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'foo',
                dealershipId: null
            }

            const numUsersBeforeRequest = await UserModel.query().resultSize()

            await server.inject({
                method: 'POST',
                url: '/signup',
                body: input
            })

            const users = await UserModel.query();

            expect(users.length).toBe(numUsersBeforeRequest);
        })
    })
})