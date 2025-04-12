import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { SendRecoverMailUseCase } from "services/user/SendRecoverMailService";
import { z } from "zod";

export async function POSTSendRecoverCode(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {id} = z.object({
            id: z.string(),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const service = new SendRecoverMailUseCase(userRepo)

        await service.execute(id)

        reply.status(201).send({
            message: "Token sent."
        })
    }
    catch(err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }

        throw err
    }
}