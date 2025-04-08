import { app } from "lib/fastify";

export function verifyToken(token: string){
    try {
        const payload = app.jwt.verify(token)
        return payload
    } catch (error) {
        throw error
    }
}