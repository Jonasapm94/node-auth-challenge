import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { makeServer } from "../../src/http/server.js";
import { IntegrationTest, setupIntegrationTest } from "../../src/_lib/testSupport/setupIntegrationTest.js";

describe("GET /vehicles", () => {
    let server: FastifyInstance
    let integrationTest: IntegrationTest

    beforeAll(async () => {
        server = await makeServer();
        integrationTest = await setupIntegrationTest()
    })

    afterAll(async () => {
        integrationTest.tearDown()
    })

    describe("when the user who made the request is not logged in", () => {
        it("the page responds with the view with vehicles", async () => {
            const response = await server.inject({
                url: '/vehicles'
            })

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(expect.stringContaining('<h1>Vehicles</h1>'))
        })
    })
})