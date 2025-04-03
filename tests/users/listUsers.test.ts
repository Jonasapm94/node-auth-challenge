import { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, it } from "vitest";
import { makeServer } from "../../src/http/server.js";

describe("GET /users", () => {
    let server: FastifyInstance

    beforeAll(async () => {
        server = await makeServer();
    })

    describe("when the user who made the request is not logged in", () => {
        it("redirects the request to login page", async () => {
            const response = await server.inject({
                url: '/users'
            })

            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toBe("/login")
        })
    })
})