import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { SendRecoverMailUseCase } from "services/user/SendRecoverMailService";
import { z } from "zod";

export async function POSTSendRecoverCode(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new SendRecoverMailUseCase(userRepo, profileRepo)

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