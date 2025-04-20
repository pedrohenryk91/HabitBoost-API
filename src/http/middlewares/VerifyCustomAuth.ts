import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "lib/fastify";
import { z, ZodError } from "zod";

export async function VerifyCustomAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        const result = z.object({
            api_auth:z.string()
        }).safeParse(request.headers)

        if(!result.success){
            throw result.error
        }
        const token = result.data.api_auth
        const decoded = app.jwt.decode(token)

        const {sub} = z.object({
            sub:z.object({
                id:z.string()
            })
        }).parse(decoded)

        request.headers.profile = sub.id.replace("7auth-","")
    } catch (err) {
        if(err instanceof ZodError){
            reply.status(401).send({
                message:"No api_auth was found in request.headers"
            })
        }
        throw err
    }
}