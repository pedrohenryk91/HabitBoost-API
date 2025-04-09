import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function GETUserData(request: FastifyRequest, reply: FastifyReply) {
    const {username} = z.object({
        username: z.string().min(3).max(20),
    }).parse(request.body)

    
}