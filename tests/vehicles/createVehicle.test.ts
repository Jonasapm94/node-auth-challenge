import { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, it } from "vitest";
import { makeServer } from "../../src/http/server.js";

describe("GET /vehicles/create", () => {
    let server: FastifyInstance

    beforeAll(async () => {
        server = await makeServer();
    })

    describe("when the user who made the request is not logged in", () => {
        it("redirects the request to login page", async () => {
            const response = await server.inject({
                url: '/vehicles/create'
            })

            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toBe("/login")
        })
    })
})