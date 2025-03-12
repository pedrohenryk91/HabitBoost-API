import { FastifyReply, FastifyRequest } from "fastify";
import { NODE_ENV } from "lib/env";
import { z } from "zod";

export async function POSTCreateUserController(request: FastifyRequest, reply: FastifyReply){
    try {
        const {email, password, username} = z.object({
            email: z.string().email(),
            password: z.string().min(6),
            username: z.string().min(3).max(20),
        }).parse(request.body)

        if(NODE_ENV === "prod"){
            //VERIFY EMAIL
        }
        //TODO: Create User Controller

    } catch (err) {
        reply.status(500).send(err)
    }
}