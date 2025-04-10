import { app } from "lib/fastify";

/**
 * Function that generates an JWT token
 * @param sub Data to be signed in the token payload
 * @returns The JWT Token -String-
 */
export function genToken(sub: string) {
    return app.jwt.sign({sub}, {expiresIn:"1h"})
}